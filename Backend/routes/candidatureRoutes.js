const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');

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
  upload.single('file'), // facultatif selon ton modèle
  candidatureController.submitCandidature
);

// 2. Valider ou rejeter une candidature (ministère uniquement)
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  candidatureController.updateCandidatureStatus
);

// 3. Voir toutes les candidatures d'une offre
router.get(
  '/offer/:offerId',
  authMiddleware,
  adminMiddleware,
  candidatureController.getCandidaturesByOffer
);

// 4. Voir ses propres candidatures (entreprise uniquement)
router.get(
  '/me',
  authMiddleware,
  entrepriseMiddleware,
  candidatureController.getMyCandidatures
);

module.exports = router;
