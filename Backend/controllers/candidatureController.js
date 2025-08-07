const db = require('../models');
const { Candidature, Offer, User, Sequelize } = db;

// POST : Soumettre une candidature (Entreprise)
exports.submitCandidature = async (req, res) => {
  const { offerId, message } = req.body;
  const entrepriseId = req.user.id;

  try {
    console.log('📝 Soumission candidature - Données reçues:', { offerId, message, file: req.file });
    
    if (!offerId) {
      return res.status(400).json({ error: 'L\'identifiant de l\'offre est requis.' });
    }

    // Vérifie que l'offre existe et est validée
    const offer = await Offer.findByPk(offerId);
    if (!offer || offer.status !== 'valide') {
      return res.status(404).json({ error: 'Offre non disponible ou non validée.' });
    }

    // Vérifie si l'entreprise a déjà postulé à cette offre
    const existing = await Candidature.findOne({
      where: { entrepriseId, offerId }
    });
    if (existing) {
      return res.status(409).json({ error: 'Vous avez déjà postulé à cette offre.' });
    }

    // Vérifier qu'au moins un fichier ou un message est fourni
    if (!req.file && (!message || message.trim().length === 0)) {
      return res.status(400).json({ error: 'Veuillez fournir au moins un fichier ou un message de motivation.' });
    }

    // Préparer l'URL du fichier si un fichier est fourni
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      console.log('📎 Fichier uploadé:', fileUrl);
    }

    // Crée la candidature
    const candidature = await Candidature.create({
      entrepriseId,
      offerId,
      message: message && message.trim() ? message.trim() : null,
      fileUrl,
      status: 'en_attente' // statut par défaut
    });
    
    console.log('✅ Candidature créée avec succès:', candidature.id);

    res.status(201).json({
      message: 'Candidature envoyée avec succès.',
      candidature
    });

  } catch (err) {
    console.error('❌ Erreur lors de la soumission de la candidature:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
      error: 'Erreur serveur, veuillez réessayer plus tard.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// PATCH : Valider ou rejeter une candidature (Admin / Ministère)
exports.updateCandidatureStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    console.log('🔄 Mise à jour statut candidature:', { candidatureId: id, newStatus: status, userId: req.user.id, userRole: req.user.role });
    
    if (!['acceptée', 'rejetée'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide. Utilisez "acceptée" ou "rejetée".' });
    }

    const candidature = await Candidature.findByPk(id);
    if (!candidature) {
      console.log('❌ Candidature non trouvée:', id);
      return res.status(404).json({ error: 'Candidature non trouvée.' });
    }

    console.log('📋 Candidature trouvée:', { id: candidature.id, currentStatus: candidature.status, offerId: candidature.offerId });

    // Si on accepte une candidature, vérifier qu'il n'y en a pas déjà une acceptée pour cette offre
    if (status === 'acceptée') {
      const existingAccepted = await Candidature.findOne({
        where: {
          offerId: candidature.offerId,
          status: 'acceptée',
          id: { [Sequelize.Op.ne]: id } // Exclure la candidature actuelle
        }
      });

      if (existingAccepted) {
        return res.status(409).json({
          error: 'Une candidature a déjà été acceptée pour cette offre. Une seule candidature peut être acceptée par offre.'
        });
      }

      // Rejeter automatiquement toutes les autres candidatures en attente pour cette offre
      const otherCandidatures = await Candidature.findAll({
        where: {
          offerId: candidature.offerId,
          status: 'en_attente',
          id: { [Sequelize.Op.ne]: id }
        }
      });

      if (otherCandidatures.length > 0) {
        await Candidature.update(
          { status: 'rejetée' },
          {
            where: {
              offerId: candidature.offerId,
              status: 'en_attente',
              id: { [Sequelize.Op.ne]: id }
            }
          }
        );
        console.log(`🔄 ${otherCandidatures.length} autres candidatures automatiquement rejetées pour l'offre ${candidature.offerId}`);
      }
    }

    const oldStatus = candidature.status;
    candidature.status = status;
    await candidature.save();

    console.log('✅ Statut mis à jour:', { from: oldStatus, to: status });

    res.json({
      message: status === 'acceptée'
        ? 'Candidature acceptée avec succès. Toutes les autres candidatures pour cette offre ont été automatiquement rejetées.'
        : 'Candidature rejetée avec succès.',
      candidature: {
        id: candidature.id,
        status: candidature.status,
        updatedAt: candidature.updatedAt
      },
      autoRejected: status === 'acceptée' ? otherCandidatures?.length || 0 : 0
    });

  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour de la candidature:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
      error: 'Erreur serveur. Veuillez réessayer.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET : Liste des candidatures pour une offre (Admin / Ministère)
exports.getCandidaturesByOffer = async (req, res) => {
  const { offerId } = req.params;

  try {
    console.log('🔍 Récupération candidatures pour offre:', offerId);
    
    const candidatures = await Candidature.findAll({
      where: { offerId },
      include: [
        {
          model: User,
          as: 'entreprise',
          attributes: ['id', 'username', 'email', 'companyName', 'nom']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Candidatures trouvées:', candidatures.length);
    res.json(candidatures);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des candidatures:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
      error: 'Erreur lors de la récupération des candidatures.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET : Liste des candidatures de l'entreprise connectée
exports.getMyCandidatures = async (req, res) => {
  const entrepriseId = req.user.id;

  try {
    console.log('🔍 Récupération candidatures pour entreprise:', entrepriseId);
    
    const candidatures = await Candidature.findAll({
      where: { entrepriseId },
      include: [
        {
          model: Offer,
          as: 'Offer',
          attributes: ['id', 'title', 'status', 'description', 'domaine']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Candidatures utilisateur trouvées:', candidatures.length);
    res.json(candidatures);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des candidatures utilisateur:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
      error: 'Erreur serveur.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
