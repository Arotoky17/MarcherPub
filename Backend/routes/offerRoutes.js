const express = require('express');
const router = express.Router();

// Middleware d'authentification Supabase
const authMiddleware = async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérification avec Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Récupérer les infos complètes depuis votre table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Accès non autorisé', error: error.message });
  }
};

// Middleware admin (ministère)
const adminMiddleware = (req, res, next) => {
  const allowedRoles = ['ministere', 'admin', 'ministerepublique'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Accès réservé au ministère. Votre rôle: ${req.user.role}`,
      allowedRoles
    });
  }
  next();
};

// Créer une nouvelle offre (accessible uniquement au ministère)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { 
      title, 
      description, 
      reference, 
      budget_max, 
      deadline, 
      requirements,
      category,
      location 
    } = req.body;

    // Validation
    if (!title || !description || !reference || !deadline) {
      return res.status(400).json({ 
        message: 'Titre, description, référence et date limite sont requis' 
      });
    }

    // Vérifier que la référence n'existe pas déjà
    const { data: existingOffer } = await supabase
      .from('offres')
      .select('id')
      .eq('reference', reference)
      .single();

    if (existingOffer) {
      return res.status(400).json({ 
        message: 'Une offre avec cette référence existe déjà' 
      });
    }

    const offerData = {
      title,
      description,
      reference,
      budget_max: budget_max ? parseFloat(budget_max) : null,
      deadline: new Date(deadline).toISOString(),
      requirements: requirements || '',
      category: category || 'general',
      location: location || '',
      status: 'published', // ou 'draft' selon votre logique
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('offres')
      .insert([offerData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Offre créée avec succès',
      offre: data
    });

  } catch (error) {
    console.error('Erreur création offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'offre',
      error: error.message 
    });
  }
});

// Récupérer toutes les offres
router.get('/', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { status, category, limit = 50 } = req.query;

    let query = supabase
      .from('offres')
      .select(`
        *,
        users!inner(name),
        candidatures(count)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Filtres optionnels
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      offres: data,
      total: data.length
    });

  } catch (error) {
    console.error('Erreur récupération offres:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des offres',
      error: error.message 
    });
  }
});

// Récupérer les offres publiées
router.get('/published', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { category, search } = req.query;

    let query = supabase
      .from('offres')
      .select(`
        *,
        users!inner(name)
      `)
      .eq('status', 'published')
      .gte('deadline', new Date().toISOString()) // Offres non expirées
      .order('created_at', { ascending: false });

    // Filtre par catégorie
    if (category) {
      query = query.eq('category', category);
    }

    // Recherche textuelle
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      offres: data,
      total: data.length
    });

  } catch (error) {
    console.error('Erreur récupération offres publiées:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des offres publiées',
      error: error.message 
    });
  }
});

// Récupérer une offre par ID
router.get('/:id', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('offres')
      .select(`
        *,
        users!inner(name, email),
        candidatures(
          id,
          status,
          created_at,
          users!inner(name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json(data);

  } catch (error) {
    console.error('Erreur récupération offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'offre',
      error: error.message 
    });
  }
});

// Valider une offre (accessible uniquement au ministère)
router.put('/:id/validate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('offres')
      .update({
        status: 'published',
        validated_at: new Date().toISOString(),
        validated_by: req.user.id
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json({
      message: 'Offre validée et publiée avec succès',
      offre: data
    });

  } catch (error) {
    console.error('Erreur validation offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la validation de l\'offre',
      error: error.message 
    });
  }
});

// Rejeter une offre (accessible uniquement au ministère)
router.put('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason) {
      return res.status(400).json({ 
        message: 'Raison de rejet requise' 
      });
    }

    const { data, error } = await supabase
      .from('offres')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: req.user.id,
        rejection_reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json({
      message: 'Offre rejetée avec succès',
      offre: data
    });

  } catch (error) {
    console.error('Erreur rejet offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors du rejet de l\'offre',
      error: error.message 
    });
  }
});

// Mettre à jour une offre (accessible uniquement au ministère)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
      updated_by: req.user.id
    };

    // Supprimer les champs non modifiables
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.created_by;

    const { data, error } = await supabase
      .from('offres')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json({
      message: 'Offre mise à jour avec succès',
      offre: data
    });

  } catch (error) {
    console.error('Erreur mise à jour offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'offre',
      error: error.message 
    });
  }
});

// Supprimer une offre (accessible uniquement au ministère)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;

    // Vérifier si l'offre a des candidatures
    const { data: candidatures, error: candidaturesError } = await supabase
      .from('candidatures')
      .select('id')
      .eq('offre_id', id);

    if (candidaturesError) throw candidaturesError;

    if (candidatures && candidatures.length > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer une offre qui a des candidatures',
        candidaturesCount: candidatures.length
      });
    }

    // Supprimer l'offre
    const { error } = await supabase
      .from('offres')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      message: 'Offre supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'offre',
      error: error.message 
    });
  }
});

// Obtenir les statistiques d'une offre
router.get('/:id/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;

    // Vérifier que l'offre existe
    const { data: offre, error: offreError } = await supabase
      .from('offres')
      .select('*')
      .eq('id', id)
      .single();

    if (offreError || !offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Statistiques des candidatures
    const [
      totalCandidatures,
      candidaturesPending,
      candidaturesAccepted,
      candidaturesRejected
    ] = await Promise.all([
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('offre_id', id),
      
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('offre_id', id)
        .eq('status', 'pending'),
      
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('offre_id', id)
        .eq('status', 'accepted'),
      
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('offre_id', id)
        .eq('status', 'rejected')
    ]);

    // Candidatures récentes avec détails
    const { data: recentCandidatures, error: recentError } = await supabase
      .from('candidatures')
      .select(`
        id,
        status,
        budget_propose,
        delai_execution,
        created_at,
        users!inner(name, email)
      `)
      .eq('offre_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    res.json({
      offre,
      stats: {
        totalCandidatures: totalCandidatures.count || 0,
        candidaturesPending: candidaturesPending.count || 0,
        candidaturesAccepted: candidaturesAccepted.count || 0,
        candidaturesRejected: candidaturesRejected.count || 0
      },
      recentCandidatures
    });

  } catch (error) {
    console.error('Erreur stats offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
});

// Dupliquer une offre (créer une copie)
router.post('/:id/duplicate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { id } = req.params;

    // Récupérer l'offre originale
    const { data: originalOffer, error: fetchError } = await supabase
      .from('offres')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !originalOffer) {
      return res.status(404).json({ message: 'Offre originale non trouvée' });
    }

    // Créer une copie avec une nouvelle référence
    const duplicateData = {
      ...originalOffer,
      id: undefined, // Laisser Supabase générer un nouvel ID
      reference: `${originalOffer.reference}_COPY_${Date.now()}`,
      title: `${originalOffer.title} (Copie)`,
      status: 'draft',
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      validated_at: null,
      validated_by: null,
      rejected_at: null,
      rejected_by: null,
      rejection_reason: null
    };

    const { data, error } = await supabase
      .from('offres')
      .insert([duplicateData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Offre dupliquée avec succès',
      offre: data
    });

  } catch (error) {
    console.error('Erreur duplication offre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la duplication de l\'offre',
      error: error.message 
    });
  }
});

module.exports = router;