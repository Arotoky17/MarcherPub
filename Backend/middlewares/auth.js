const jwt = require('jsonwebtoken');
const { User } = require('../models'); // ✅ corriger ici

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id); // ✅ maintenant fonctionne
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur authMiddleware:', error.message);
    return res.status(401).json({ message: 'Accès non autorisé', error: error.message });
  }
};

const adminMiddleware = (req, res, next) => {
  // Accepter les rôles ministere, admin ET ministerepublique
  const allowedRoles = ['ministere', 'admin', 'ministerepublique'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Accès réservé au ministère. Votre rôle: ${req.user.role}`,
      allowedRoles
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
