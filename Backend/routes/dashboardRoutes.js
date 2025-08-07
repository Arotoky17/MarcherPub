const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Middleware pour vérifier le rôle entreprise
const entrepriseMiddleware = (req, res, next) => {
  if (req.user.role !== 'entreprise') {
    return res.status(403).json({ message: 'Accès réservé aux entreprises' });
  }
  next();
};

// Dashboard entreprise
router.get('/entreprise', authMiddleware, entrepriseMiddleware, dashboardController.getEntrepriseDashboard);

// Dashboard ministère
router.get('/ministere', authMiddleware, adminMiddleware, dashboardController.getMinistereDashboard);

module.exports = router;
