const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Configuration
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = 12; // Augmenté pour plus de sécurité
const TOKEN_EXPIRATION = '1h';

// Messages d'erreur centralisés
const ERROR_MESSAGES = {
  USERNAME_TAKEN: 'Nom d\'utilisateur déjà pris',
  EMAIL_TAKEN: 'Email déjà utilisé',
  INVALID_CREDS: 'Identifiants invalides',
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  REGISTER_SUCCESS: 'Inscription réussie',
  DELETE_SUCCESS: 'Utilisateur supprimé'
};

// Validation des entrées
const validateRegisterInput = (data) => {
  if (!data.username || !data.email || !data.password) {
    return 'Tous les champs sont obligatoires';
  }
  if (data.password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  return null;
};

exports.register = async (req, res) => {
  const validationError = validateRegisterInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { username, email, password, companyName } = req.body;

  try {
    // Vérification des doublons en une seule requête
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      const error = existingUser.username === username 
        ? ERROR_MESSAGES.USERNAME_TAKEN 
        : ERROR_MESSAGES.EMAIL_TAKEN;
      return res.status(400).json({ error });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      companyName,
      role: 'entreprise'
    });

    // Ne pas renvoyer le mot de passe
    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    };

    res.status(201).json({ 
      message: ERROR_MESSAGES.REGISTER_SUCCESS,
      user: userData 
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de l\'inscription',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    const user = await User.findOne({ 
      where: { username },
      attributes: ['id', 'username', 'email', 'password', 'role', 'companyName']
    });

    if (!user) {
      return res.status(401).json({ error: ERROR_MESSAGES.INVALID_CREDS });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: ERROR_MESSAGES.INVALID_CREDS });
    }

    // Payload JWT minimal
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      }, 
      SECRET_KEY, 
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Réponse sécurisée
    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    };

    res.json({
      token,
      user: userData,
      expiresIn: TOKEN_EXPIRATION
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la connexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Accès non autorisé' });
     }

    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'companyName', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      error: 'Erreur récupération utilisateurs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Vérifier les permissions
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Accès non autorisé' });
     }

    const deleted = await User.destroy({ 
      where: { username: req.params.username } 
    });

    if (!deleted) {
      return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.json({ message: ERROR_MESSAGES.DELETE_SUCCESS });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Erreur suppression utilisateur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};