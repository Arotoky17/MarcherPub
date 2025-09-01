const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Gardez si vous l'avez

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

// Middleware pour vérifier le rôle entreprise
const entrepriseMiddleware = (req, res, next) => {
  if (req.user.role !== 'entreprise') {
    return res.status(403).json({ message: 'Accès réservé aux entreprises' });
  }
  next();
};

// 1. Soumettre une candidature (entreprise uniquement)
router.post(
  '/',
  authMiddleware,
  entrepriseMiddleware,
  upload ? upload.single('file') : (req, res, next) => next(), // Upload facultatif
  async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const { offre_id, message, budget_propose, delai_execution } = req.body;

      // Validation
      if (!offre_id) {
        return res.status(400).json({ message: 'ID de l\'offre requis' });
      }

      // Vérifier que l'offre existe et est publiée
      const { data: offre, error: offreError } = await supabase
        .from('offres')
        .select('*')
        .eq('id', offre_id)
        .eq('status', 'published')
        .single();

      if (offreError || !offre) {
        return res.status(404).json({ message: 'Offre non trouvée ou non publiée' });
      }

      // Vérifier si l'utilisateur a déjà candidaté
      const { data: existingCandidature } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('offre_id', offre_id)
        .single();

      if (existingCandidature) {
        return res.status(400).json({ message: 'Vous avez déjà candidaté pour cette offre' });
      }

      // Créer la candidature
      const candidatureData = {
        user_id: req.user.id,
        offre_id: parseInt(offre_id),
        message: message || '',
        budget_propose: budget_propose ? parseFloat(budget_propose) : null,
        delai_execution: delai_execution ? parseInt(delai_execution) : null,
        file_path: req.file ? req.file.path : null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('candidatures')
        .insert([candidatureData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Candidature soumise avec succès',
        candidature: data
      });

    } catch (error) {
      console.error('Erreur soumission candidature:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la soumission',
        error: error.message 
      });
    }
  }
);

// 2. Valider ou rejeter une candidature (ministère uniquement)
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const { id } = req.params;
      const { status, rejection_reason } = req.body;

      // Validation du status
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          message: 'Status doit être "accepted" ou "rejected"' 
        });
      }

      if (status === 'rejected' && !rejection_reason) {
        return res.status(400).json({ 
          message: 'Raison de rejet requise' 
        });
      }

      // Mettre à jour la candidature
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        reviewed_by: req.user.id
      };

      if (status === 'rejected') {
        updateData.rejection_reason = rejection_reason;
        updateData.rejected_at = new Date().toISOString();
      } else {
        updateData.accepted_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('candidatures')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ message: 'Candidature non trouvée' });
      }

      res.json({
        message: `Candidature ${status === 'accepted' ? 'acceptée' : 'rejetée'} avec succès`,
        candidature: data
      });

    } catch (error) {
      console.error('Erreur mise à jour candidature:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la mise à jour',
        error: error.message 
      });
    }
  }
);

// 3. Voir toutes les candidatures d'une offre (ministère uniquement)
router.get(
  '/offer/:offerId',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const { offerId } = req.params;

      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          users!inner(
            id,
            name,
            email,
            role
          )
        `)
        .eq('offre_id', offerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        candidatures: data,
        total: data.length
      });

    } catch (error) {
      console.error('Erreur récupération candidatures:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération',
        error: error.message 
      });
    }
  }
);

// 4. Voir ses propres candidatures (entreprise uniquement)
router.get(
  '/me',
  authMiddleware,
  entrepriseMiddleware,
  async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;

      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          offres!inner(
            id,
            title,
            reference,
            deadline,
            status
          )
        `)
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        candidatures: data,
        total: data.length
      });

    } catch (error) {
      console.error('Erreur récupération mes candidatures:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération',
        error: error.message 
      });
    }
  }
);

// 5. Récupérer une candidature spécifique
router.get(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const { id } = req.params;

      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          users!inner(name, email),
          offres!inner(title, reference)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ message: 'Candidature non trouvée' });
      }

      // Vérifier les droits d'accès
      const isOwner = data.user_id === req.user.id;
      const isAdmin = ['ministere', 'admin', 'ministerepublique'].includes(req.user.role);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé à cette candidature' });
      }

      res.json(data);

    } catch (error) {
      console.error('Erreur récupération candidature:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération',
        error: error.message 
      });
    }
  }
);

module.exports = router;