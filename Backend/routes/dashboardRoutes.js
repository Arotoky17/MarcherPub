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

// Middleware pour vérifier le rôle entreprise
const entrepriseMiddleware = (req, res, next) => {
  if (req.user.role !== 'entreprise') {
    return res.status(403).json({ message: 'Accès réservé aux entreprises' });
  }
  next();
};

// Dashboard entreprise
router.get('/entreprise', authMiddleware, entrepriseMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.user.id;

    // Statistiques pour l'entreprise
    const [
      mesCandidatures,
      candidaturesAcceptees,
      candidaturesEnAttente,
      candidaturesRejetees,
      offresDisponibles
    ] = await Promise.all([
      // Mes candidatures
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('user_id', userId),
      
      // Candidatures acceptées
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'accepted'),
      
      // Candidatures en attente
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'pending'),
      
      // Candidatures rejetées
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'rejected'),
      
      // Offres disponibles
      supabase
        .from('offres')
        .select('count', { count: 'exact' })
        .eq('status', 'published')
    ]);

    // Dernières candidatures avec détails
    const { data: recentCandidatures, error: candidaturesError } = await supabase
      .from('candidatures')
      .select(`
        *,
        offres!inner(
          id,
          title,
          reference,
          budget_max,
          deadline
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (candidaturesError) throw candidaturesError;

    // Offres récentes disponibles
    const { data: offresRecentes, error: offresError } = await supabase
      .from('offres')
      .select('id, title, reference, budget_max, deadline, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10);

    if (offresError) throw offresError;

    res.json({
      user: req.user,
      stats: {
        totalCandidatures: mesCandidatures.count || 0,
        candidaturesAcceptees: candidaturesAcceptees.count || 0,
        candidaturesEnAttente: candidaturesEnAttente.count || 0,
        candidaturesRejetees: candidaturesRejetees.count || 0,
        offresDisponibles: offresDisponibles.count || 0
      },
      recentCandidatures,
      offresRecentes
    });

  } catch (error) {
    console.error('Erreur dashboard entreprise:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du dashboard',
      error: error.message 
    });
  }
});

// Dashboard ministère
router.get('/ministere', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    // Statistiques globales
    const [
      totalUsers,
      totalEntreprises,
      totalOffres,
      offresPubliees,
      offresPendantes,
      totalCandidatures,
      candidaturesEnAttente,
      candidaturesAcceptees
    ] = await Promise.all([
      // Total utilisateurs
      supabase
        .from('users')
        .select('count', { count: 'exact' }),
      
      // Total entreprises
      supabase
        .from('users')
        .select('count', { count: 'exact' })
        .eq('role', 'entreprise'),
      
      // Total offres
      supabase
        .from('offres')
        .select('count', { count: 'exact' }),
      
      // Offres publiées
      supabase
        .from('offres')
        .select('count', { count: 'exact' })
        .eq('status', 'published'),
      
      // Offres en attente
      supabase
        .from('offres')
        .select('count', { count: 'exact' })
        .eq('status', 'pending'),
      
      // Total candidatures
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' }),
      
      // Candidatures en attente
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('status', 'pending'),
      
      // Candidatures acceptées
      supabase
        .from('candidatures')
        .select('count', { count: 'exact' })
        .eq('status', 'accepted')
    ]);

    // Offres récentes avec candidatures
    const { data: offresRecentes, error: offresError } = await supabase
      .from('offres')
      .select(`
        *,
        candidatures(count)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (offresError) throw offresError;

    // Candidatures récentes avec détails
    const { data: candidaturesRecentes, error: candidaturesError } = await supabase
      .from('candidatures')
      .select(`
        *,
        users!inner(name, email),
        offres!inner(title, reference)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (candidaturesError) throw candidaturesError;

    // Activité récente (dernières inscriptions)
    const { data: nouvellesInscriptions, error: inscriptionsError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('role', 'entreprise')
      .order('created_at', { ascending: false })
      .limit(5);

    if (inscriptionsError) throw inscriptionsError;

    res.json({
      user: req.user,
      stats: {
        totalUsers: totalUsers.count || 0,
        totalEntreprises: totalEntreprises.count || 0,
        totalOffres: totalOffres.count || 0,
        offresPubliees: offresPubliees.count || 0,
        offresPendantes: offresPendantes.count || 0,
        totalCandidatures: totalCandidatures.count || 0,
        candidaturesEnAttente: candidaturesEnAttente.count || 0,
        candidaturesAcceptees: candidaturesAcceptees.count || 0
      },
      offresRecentes,
      candidaturesRecentes,
      nouvellesInscriptions
    });

  } catch (error) {
    console.error('Erreur dashboard ministère:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du dashboard',
      error: error.message 
    });
  }
});

// Statistiques avancées pour le ministère
router.get('/stats/advanced', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    // Candidatures par mois (6 derniers mois)
    const { data: candidaturesParMois, error: statsError } = await supabase
      .from('candidatures')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString());

    if (statsError) throw statsError;

    // Grouper par mois
    const candidaturesGroupees = candidaturesParMois.reduce((acc, candidature) => {
      const mois = new Date(candidature.created_at).toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long' 
      });
      acc[mois] = (acc[mois] || 0) + 1;
      return acc;
    }, {});

    res.json({
      candidaturesParMois: candidaturesGroupees,
      totalAnalyse: candidaturesParMois.length
    });

  } catch (error) {
    console.error('Erreur stats avancées:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
});

module.exports = router;