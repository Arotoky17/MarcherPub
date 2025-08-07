const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const offerController = require('../controllers/offerController');

// Créer une nouvelle offre (accessible uniquement au ministère)
router.post('/', authMiddleware, adminMiddleware, offerController.createOffer);

// Récupérer toutes les offres
router.get('/', offerController.getAllOffers);

// Récupérer les offres publiées
router.get('/published', offerController.getPublishedOffers);

// Récupérer une offre par ID
router.get('/:id', offerController.getOfferById);

// Valider une offre (accessible uniquement au ministère)
router.put('/:id/validate', authMiddleware, adminMiddleware, offerController.validateOffer);

// Rejeter une offre (accessible uniquement au ministère)
router.put('/:id/reject', authMiddleware, adminMiddleware, offerController.rejectOffer);

// Supprimer une offre (accessible uniquement au ministère)
router.delete('/:id', authMiddleware, adminMiddleware, offerController.deleteOffer);

module.exports = router;
