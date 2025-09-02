require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialisation d’Express
const app = express();
const PORT = process.env.PORT || 3001;

// Vérification clé secrète JWT
if (!process.env.SECRET_KEY || process.env.SECRET_KEY.length < 32) {
  throw new Error('ERREUR CRITIQUE: SECRET_KEY manquante ou trop faible (32+ caractères requis)');
}

// Sécurité + logs + parsing
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS avec normalisation des URLs et support d'origines multiples
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://marcher-pub-2y3i.vercel.app',
  'marcher-pub-2y3i-2pp0ugaqe-arotoky17s-projects.vercel.app',
  ...envOrigins
].filter(Boolean);

// Autoriser des patterns (préviews vercel, render, etc.)
const allowedOriginPatterns = [
  /^https?:\/\/.*\.vercel\.app$/,
  /^https?:\/\/.*\.onrender\.com$/
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / mobile apps
    const normalizedOrigin = origin.replace(/\/$/, '');
    const allowed = allowedOrigins.map(o => (o || '').replace(/\/$/, ''));
    const isExplicit = allowed.includes(normalizedOrigin);
    const isPattern = allowedOriginPatterns.some(re => re.test(normalizedOrigin));
    if (isExplicit || isPattern) return callback(null, true);
    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  exposedHeaders: ['Content-Length']
}));

// Répondre aux pré-vols
app.options('*', cors());

// Servir fichiers statiques
app.use('/uploads', express.static('uploads'));
app.use('/favicon.ico', express.static('favicon.ico'));

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔍 SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);

// Sequelize
const db = require('./models');
const { User, Offer, sequelize } = db;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // À désactiver en production
    console.log('✅ Connecté à la base de données');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error.message);
  }
})();

// Middleware auth JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error.message);
    return res.status(401).json({ message: 'Accès non autorisé', error: error.message });
  }
};

// Middleware rôle ministère / admin
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

// Routes debug et test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur backend opérationnel', timestamp: new Date().toISOString(), port: PORT });
});

app.get('/api/debug/routes', (req, res) => {
  res.json({ availableRoutes: [
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
  ]});
});

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/offres', require('./routes/offerRoutes'));
app.use('/api/candidatures', require('./routes/candidatureRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Test rôle utilisateur
app.get('/api/test-role', authMiddleware, (req, res) => {
  if (['ministere','admin','ministerepublique'].includes(req.user.role)) {
    return res.json({ message: `Vous êtes administrateur (${req.user.role})` });
  }
  if (req.user.role === 'entreprise') return res.json({ message: 'Vous êtes une entreprise' });
  return res.status(403).json({ message: `Rôle non reconnu: ${req.user.role}` });
});

// Gestion globale des erreurs serveur
app.use((err, req, res, next) => {
  console.error('Erreur non capturée :', err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
