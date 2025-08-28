const { Offer } = require('../models');

// ✅ Créer une offre
exports.createOffer = async (req, res) => {
  try {
    console.log('=== CRÉATION OFFRE ===');
    console.log('Body reçu:', req.body);

    const { title, description, domaine, dateLimite } = req.body;

    // Vérifie que tous les champs sont fournis
    if (!title || !description || !domaine || !dateLimite) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
        missing: {
          title: !title,
          description: !description,
          domaine: !domaine,
          dateLimite: !dateLimite
        }
      });
    }

    const dateObj = new Date(dateLimite);
    if (isNaN(dateObj.getTime()) || dateObj <= new Date()) {
      return res.status(400).json({ message: "Date limite invalide" });
    }

    // ✅ Vérifie que l'utilisateur est bien là
    console.log("✅ Utilisateur connecté :", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié (req.user manquant)" });
    }

    // Création de l'offre
    const newOffer = await Offer.create({
      title: title.trim(),
      description: description.trim(),
      domaine: domaine.trim(),
      dateLimite: dateObj,
      status: 'en_attente',
      createdById: req.user.id
    });

    console.log('✅ Offre créée avec succès, ID:', newOffer.id);

    return res.status(201).json({
      message: "Offre créée avec succès",
      offre: newOffer
    });

  } catch (err) {
    console.error('❌ Erreur création:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// 📢 Offres publiées
exports.getPublishedOffers = async (req, res) => {
  try {
    const offres = await Offer.findAll({
      where: { status: 'valide' },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      message: "Offres publiées récupérées",
      count: offres.length,
      offres
    });
  } catch (err) {
    console.error('❌ Erreur récupération offres publiées:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// 📂 Toutes les offres
exports.getAllOffers = async (req, res) => {
  try {
    const offres = await Offer.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      message: "Offres récupérées",
      count: offres.length,
      offres
    });
  } catch (err) {
    console.error('❌ Erreur récupération toutes les offres:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// 📄 Une offre par ID
exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const offre = await Offer.findByPk(id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.json({
      message: "Offre trouvée",
      offre
    });
  } catch (err) {
    console.error('❌ Erreur récupération offre par ID:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// ✅ Supprimer une offre
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deleted = await Offer.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error('❌ Erreur suppression offre:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// ✅ Valider une offre
exports.validateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offre = await Offer.findByPk(id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    await offre.update({
      status: 'valide',
      validatedAt: new Date()
    });

    return res.json({
      message: "Offre validée",
      offre
    });
  } catch (err) {
    console.error('❌ Erreur validation offre:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// ❌ Rejeter une offre
exports.rejectOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offre = await Offer.findByPk(id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    await offre.update({
      status: 'rejetée',
      rejectedAt: new Date()
    });

    return res.json({
      message: "Offre rejetée",
      offre
    });
  } catch (err) {
    console.error('❌ Erreur rejet offre:', err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};
