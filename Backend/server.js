require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// Initialisation d’Express
const app = express();
const PORT = process.env.PORT || 3001;

// Sécurité + logs + parsing
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static('uploads'));
console.log('📁 Fichiers statiques uploads configurés sur /uploads');

// Importation des modèles Sequelize
const db = require('./models');
const { User, Offer, sequelize } = db;

// Connexion à la base de données
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // À désactiver en production
    console.log('✅ Connecté à la base de données');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error.message);
  }
})();

// Middleware de vérification du token JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error.message);
    return res.status(401).json({ message: 'Accès non autorisé', error: error.message });
  }
};

// Middleware pour vérifier le rôle "ministere"
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

// Routes de test et debug
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur backend opérationnel',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.get('/api/debug/routes', (req, res) => {
  res.json({
    availableRoutes: [
      'GET /api/health',
      'GET /api/debug/routes',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/offres',
      'POST /api/offres',
      'GET /api/offres/published',
      'GET /api/offres/:id',
      'PUT /api/offres/:id/validate',
      'PUT /api/offres/:id/reject',
      'DELETE /api/offres/:id',
      'POST /api/candidatures',
      'GET /api/candidatures/me'
    ]
  });
});

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));  // Ce fichier est dans routes/ (minuscule)

// Ajouter des logs pour debug
console.log('🔧 Montage des routes /api/offres...');
try {
  app.use('/api/offres', require('./routes/offerRoutes'));  // Correction: routes avec r minuscule
  console.log('✅ Routes /api/offres montées avec succès');
} catch (error) {
  console.error('❌ Erreur lors du montage des routes /api/offres:', error);
}

console.log('🔧 Montage des routes /api/candidatures...');
try {
  app.use('/api/candidatures', require('./routes/candidatureRoutes'));  // Ce dossier existe avec r minuscule
  console.log('✅ Routes /api/candidatures montées avec succès');
} catch (error) {
  console.error('❌ Erreur lors du montage des routes /api/candidatures:', error);
}

console.log('🔧 Montage des routes /api/dashboard...');
try {
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
  console.log('✅ Routes /api/dashboard montées avec succès');
} catch (error) {
  console.error('❌ Erreur lors du montage des routes /api/dashboard:', error);
}

// Route de test pour vérifier le rôle de l'utilisateur
app.get('/api/test-role', authMiddleware, (req, res) => {
  if (['ministere', 'admin', 'ministerepublique'].includes(req.user.role)) {
    return res.json({ message: `Vous êtes administrateur (${req.user.role})` });
  }
  if (req.user.role === 'entreprise') {
    return res.json({ message: 'Vous êtes une entreprise' });
  }
  return res.status(403).json({ message: `Rôle non reconnu: ${req.user.role}` });
});

// Gestion globale des erreurs serveur
app.use((err, req, res, next) => {
  console.error('Erreur non capturée :', err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
