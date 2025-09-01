const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Si vous voulez hasher les mots de passe en plus

// Middleware d'authentification Supabase
const authMiddleware = async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
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

    // Récupérer les infos complètes depuis votre table users
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
    console.error('Erreur middleware auth:', error); // Log full error object
    return res.status(401).json({ message: 'Accès non autorisé', error: error.message });
  }
};

// Route d'inscription pour entreprise
router.post('/register', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { email, password, name, role = 'entreprise', ...otherData } = req.body;

    // Validation basique
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, mot de passe et nom sont requis' 
      });
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      throw authError;
    }

    // Ajouter les données supplémentaires dans la table users
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: authData.user.email,
        name,
        role,
        ...otherData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    res.status(201).json({
      message: 'Inscription réussie',
      user: userRecord,
      needsEmailConfirmation: !authData.user.email_confirmed_at
    });

  } catch (error) {
    console.error('Erreur inscription:', error); // Log full error object
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription',
      error: error.message 
    });
  }
});

// Route de connexion (tous les rôles)
router.post('/login', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email et mot de passe requis' 
      });
    }

    // Connexion avec Supabase Auth
    const { data: { session }, error: authError } = await supabase.auth.signIn({
      email,
      password
    });

    if (authError) {
      throw authError;
    }

    // Récupérer les infos de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    res.json({
      message: 'Connexion réussie',
      user: userData,
      accessToken: session.access_token,
      refreshToken: session.refresh_token
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      error: error.message 
    });
  }
});

// Route de déconnexion (tous les rôles)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { user } = req;

    // Déconnexion avec Supabase Auth
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la déconnexion',
      error: error.message 
    });
  }
});

module.exports = router;