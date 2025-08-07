const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Route d'inscription pour entreprise
router.post('/register', authController.register);

// Route de connexion (tous les rôles)
router.post('/login', authController.login);

// Route de vérification du token (après authentification)
router.get('/verify', authMiddleware, (req, res)  => {
  res.json({ message: 'Token validé avec succès' });
});


module.exports = router;