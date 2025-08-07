const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Configuration sécurisée
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = 12; // Augmenté pour plus de sécurité
const TOKEN_EXPIRATION = '1h';

// Vérification robuste de la clé secrète
if (!SECRET_KEY || SECRET_KEY.length < 32) {
  console.error('ERREUR CRITIQUE: Clé secrète manquante ou trop faible (32+ caractères requis)');
  process.exit(1);
}

// Messages et redirections centralisés
const AUTH_CONFIG = {
  ERRORS: {
    USERNAME_TAKEN: 'Nom d\'utilisateur déjà utilisé',
    EMAIL_TAKEN: 'Email déjà utilisé',
    INVALID_CREDS: 'Identifiants incorrects',
    SERVER_ERROR: 'Erreur du serveur',
    MISSING_FIELDS: 'Tous les champs sont obligatoires'
  },
  SUCCESS: {
    REGISTER: 'Compte créé avec succès'
  },
  REDIRECTS: {
    ENTREPRISE: '/entreprise/home',
    MINISTERE: '/ministere/home',
    DEFAULT: '/dashboard'
  }
};

exports.register = async (req, res) => {
  const { username, password, email, companyName } = req.body;

  try {
    // Validation des données
    if (!username || !password || !email) {
      return res.status(400).json({ error: AUTH_CONFIG.ERRORS.MISSING_FIELDS });
    }

    // Vérification des doublons optimisée
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username 
          ? AUTH_CONFIG.ERRORS.USERNAME_TAKEN 
          : AUTH_CONFIG.ERRORS.EMAIL_TAKEN
      });
    }

    // Hachage sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Création de l'utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      companyName,
      role: 'entreprise' // Valeur par défaut
    });

    // Réponse sécurisée sans données sensibles
    res.status(201).json({ 
      message: AUTH_CONFIG.SUCCESS.REGISTER,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        companyName: newUser.companyName
      }
    });

  } catch (err) {
    console.error('Erreur d\'inscription:', err);
    res.status(500).json({ 
      error: AUTH_CONFIG.ERRORS.SERVER_ERROR,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validation des entrées
    if (!username || !password) {
      return res.status(400).json({ error: AUTH_CONFIG.ERRORS.MISSING_FIELDS });
    }

    // Récupération sécurisée de l'utilisateur
    const user = await User.findOne({ 
      where: { username },
      attributes: ['id', 'username', 'email', 'password', 'role', 'companyName']
    });

    if (!user) {
      return res.status(401).json({ error: AUTH_CONFIG.ERRORS.INVALID_CREDS });
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: AUTH_CONFIG.ERRORS.INVALID_CREDS });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      }, 
      SECRET_KEY, 
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Détermination de la redirection
    let redirectTo;
    switch(user.role) {
      case 'entreprise':
        redirectTo = AUTH_CONFIG.REDIRECTS.ENTREPRISE;
        break;
      case 'admin':
      case 'ministere':
      case 'ministerepublique':
        redirectTo = AUTH_CONFIG.REDIRECTS.MINISTERE;
        break;
      default:
        redirectTo = AUTH_CONFIG.REDIRECTS.DEFAULT;
    }

    // Réponse complète
    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      },
      redirectTo, // Ajout de la redirection
      expiresIn: TOKEN_EXPIRATION
    });

  } catch (err) {
    console.error('Erreur de connexion:', err);
    res.status(500).json({ 
      error: AUTH_CONFIG.ERRORS.SERVER_ERROR,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};