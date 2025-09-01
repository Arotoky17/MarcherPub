require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialisation d'Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configuration Supabase
console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔍 SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Sécurité + logs + parsing
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'https://marcher-pub-2y3i.vercel.app', // Nouveau lien Vercel
  process.env.FRONTEND_URL  
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (comme Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static('uploads'));
console.log('📁 Fichiers statiques uploads configurés sur /uploads');

// Servir le favicon si demandé au backend
app.use('/favicon.ico', express.static('favicon.ico'));

// Middleware de vérification du token JWT pour Supabase
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérification avec Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Récupérer les infos complètes de l'utilisateur depuis votre table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = userData;
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
    port: PORT,
    supabaseConnected: !!process.env.SUPABASE_URL
  });
});

// Test de connexion Supabase
app.get('/api/test-supabase', async (req, res) => {
  try {
    const usersTest = await supabase.from('users').select('count', { count: 'exact' });
    const offresTest = await supabase.from('offres').select('count', { count: 'exact' });
    const candidaturesTest = await supabase.from('candidatures').select('count', { count: 'exact' });
    
    res.json({
      success: true,
      message: 'Supabase connecté!',
      tables: {
        users: usersTest.count || 0,
        offres: offresTest.count || 0,
        candidatures: candidaturesTest.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/debug/routes', (req, res) => {
  res.json({
    availableRoutes: [
      'GET /api/health',
      'GET /api/test-supabase',
      'GET /api/debug/routes',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/users',
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

// Routes API CRUD avec Supabase

// Routes Users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Offres
app.get('/api/offres', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/offres/published', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/offres/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/offres', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const offreData = {
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('offres')
      .insert([offreData])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/offres/:id/validate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .update({ 
        status: 'published',
        validated_at: new Date().toISOString(),
        validated_by: req.user.id
      })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/offres/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .update({ 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: req.user.id,
        rejection_reason: req.body.reason
      })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/offres/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('offres')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Candidatures
app.get('/api/candidatures', authMiddleware, async (req, res) => {
  try {
    let query = supabase.from('candidatures').select(`
      *,
      offres(title, reference),
      users(name, email)
    `);

    // Si c'est une entreprise, montrer seulement ses candidatures
    if (req.user.role === 'entreprise') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/candidatures/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .select(`
        *,
        offres(title, reference, deadline)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/candidatures', authMiddleware, async (req, res) => {
  try {
    // Vérifier que l'offre existe et est publiée
    const { data: offre, error: offreError } = await supabase
      .from('offres')
      .select('*')
      .eq('id', req.body.offre_id)
      .eq('status', 'published')
      .single();

    if (offreError || !offre) {
      return res.status(404).json({ message: 'Offre non trouvée ou non publiée' });
    }

    // Vérifier si l'utilisateur a déjà candidaté
    const { data: existingCandidature } = await supabase
      .from('candidatures')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('offre_id', req.body.offre_id)
      .single();

    if (existingCandidature) {
      return res.status(400).json({ message: 'Vous avez déjà candidaté pour cette offre' });
    }

    const candidatureData = {
      ...req.body,
      user_id: req.user.id,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('candidatures')
      .insert([candidatureData])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes d'authentification avec Supabase Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, ...userData } = req.body;

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    // Ajouter les données supplémentaires dans la table users
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: authData.user.email,
        ...userData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) throw userError;

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Récupérer les données utilisateur depuis votre table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    res.json({
      message: 'Connexion réussie',
      user: userData,
      session: authData.session
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Routes dashboard
app.get('/api/dashboard/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [usersCount, offresCount, candidaturesCount] = await Promise.all([
      supabase.from('users').select('count', { count: 'exact' }),
      supabase.from('offres').select('count', { count: 'exact' }),
      supabase.from('candidatures').select('count', { count: 'exact' })
    ]);

    res.json({
      users: usersCount.count || 0,
      offres: offresCount.count || 0,
      candidatures: candidaturesCount.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gestion globale des erreurs serveur
app.use((err, req, res, next) => {
  console.error('Erreur non capturée :', err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`🌐 Accessible sur https://marcherpub.onrender.com`);
});