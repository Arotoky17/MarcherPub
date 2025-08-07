const db = require('../models');
const { Candidature, Offer, User } = db;

// Dashboard pour les entreprises
exports.getEntrepriseDashboard = async (req, res) => {
  try {
    const entrepriseId = req.user.id;

    // Récupérer les offres où l'entreprise a postulé ou les offres créées par l'entreprise (si elle en a créé)
    const offers = await Offer.findAll({
      where: {
        status: 'valide'
        // On récupère toutes les offres valides pour l'affichage général
      },
      order: [['createdAt', 'DESC']],
      limit: 10 // Dernières 10 offres
    });

    // Récupérer les candidatures de l'entreprise
    const candidatures = await Candidature.findAll({
      where: { entrepriseId },
      include: [
        {
          model: Offer,
          as: 'Offer',
          attributes: ['id', 'title', 'status']
        }
      ]
    });

    // Calculer les statistiques spécifiques à l'entreprise
    const stats = {
      totalOffres: offers.length, // Offres disponibles
      totalCandidatures: candidatures.length, // Candidatures de l'entreprise
      candidaturesEnAttente: candidatures.filter(c => c.status === 'en_attente').length,
      candidaturesValides: candidatures.filter(c => c.status === 'acceptée').length, // Corriger 'valide' -> 'acceptée'
      candidaturesRejetees: candidatures.filter(c => c.status === 'rejetée').length // Corriger 'rejetee' -> 'rejetée'
    };

    res.json({
      message: 'Dashboard entreprise récupéré',
      offers: offers.map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        domaine: offer.domaine,
        dateLimite: offer.dateLimite,
        createdAt: offer.createdAt
      })),
      candidatures: candidatures.map(candidature => ({
        id: candidature.id,
        status: candidature.status,
        createdAt: candidature.createdAt,
        offer: candidature.Offer
      })),
      stats
    });

  } catch (error) {
    console.error('Erreur dashboard entreprise:', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Dashboard pour le ministère
exports.getMinistereDashboard = async (req, res) => {
  try {
    console.log('🔍 Début de getMinistereDashboard');

    // Récupérer tous les utilisateurs
    const users = await User.findAll({
      attributes: ['id', 'nom', 'username', 'email', 'role', 'createdAt', 'companyName'],
      order: [['createdAt', 'DESC']]
    });
    console.log('✅ Users récupérés:', users.length);

    // Récupérer toutes les offres (sans associations complexes)
    const offers = await Offer.findAll({
      attributes: ['id', 'title', 'description', 'domaine', 'status', 'createdAt', 'createdById'],
      order: [['createdAt', 'DESC']]
    });
    console.log('✅ Offers récupérées:', offers.length);

    // Récupérer toutes les candidatures (sans associations complexes)
    const candidatures = await Candidature.findAll({
      attributes: ['id', 'status', 'createdAt', 'entrepriseId', 'offerId'],
      order: [['createdAt', 'DESC']]
    });
    console.log('✅ Candidatures récupérées:', candidatures.length);

    // Statistiques des utilisateurs
    const userStats = {
      total: users.length,
      entreprise: users.filter(u => u.role === 'entreprise').length,
      admin: users.filter(u => u.role === 'admin').length,
      ministere: users.filter(u => u.role === 'ministere').length,
      ministerepublique: users.filter(u => u.role === 'ministerepublique').length
    };

    // Statistiques des offres
    const offerStats = {
      total: offers.length,
      valides: offers.filter(o => o.status === 'valide').length,
      enAttente: offers.filter(o => o.status === 'en_attente').length,
      rejetees: offers.filter(o => o.status === 'rejetée').length
    };

    // Statistiques des candidatures
    const candidatureStats = {
      total: candidatures.length,
      enAttente: candidatures.filter(c => c.status === 'en_attente').length,
      acceptees: candidatures.filter(c => c.status === 'acceptée').length,
      rejetees: candidatures.filter(c => c.status === 'rejetée').length
    };

    // Données pour les graphiques (derniers 6 mois)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyUsers = users.filter(u => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      const monthlyOffers = offers.filter(o => {
        const createdAt = new Date(o.createdAt);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;

      monthlyData.push({
        month: date.toLocaleString('fr-FR', { month: 'short' }),
        users: monthlyUsers,
        offers: monthlyOffers
      });
    }

    // Enrichir les données d'offres avec les informations de l'entreprise
    const enrichedOffers = offers.slice(0, 10).map(offer => {
      const creator = users.find(u => u.id === offer.createdById);
      return {
        ...offer.toJSON(),
        company: creator ? {
          companyName: creator.companyName || creator.username,
          nom: creator.nom
        } : null
      };
    });

    console.log('✅ Dashboard data prepared successfully');

    res.json({
      message: 'Dashboard ministère récupéré',
      users: users.slice(0, 10), // 10 derniers utilisateurs
      offers: enrichedOffers, // 10 dernières offres enrichies
      candidatures: candidatures.slice(0, 10), // 10 dernières candidatures
      stats: {
        users: userStats,
        offers: offerStats,
        candidatures: candidatureStats
      },
      chartData: monthlyData
    });

  } catch (error) {
    console.error('❌ Erreur dashboard ministère:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
