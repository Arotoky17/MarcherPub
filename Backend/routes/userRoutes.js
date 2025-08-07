const express = require('express');
const router = express.Router();
// Correction ici : utilisez 'authenticateToken' et 'authorizeRoles'
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const db = require('../models');
const User = db.User;

// Suppression d'un utilisateur (admin/ministère uniquement)
// Correction ici : 'authorizeRoles' au lieu de 'requireRole'
router.delete('/:username', authenticateToken, authorizeRoles('ministere'), async (req, res) => {
  try {
    // Vérifiez si l'utilisateur existe avant de tenter de le supprimer
    const userToDelete = await User.findOne({ where: { username: req.params.username } });
    if (!userToDelete) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Optionnel : empêcher un ministère de supprimer un autre ministère
    // if (userToDelete.role === 'ministere' && req.user.role !== 'super_admin') {
    //   return res.status(403).json({ message: 'Non autorisé à supprimer un autre ministère' });
    // }

    await User.destroy({ where: { username: req.params.username } });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
});


// Obtenir tous les utilisateurs (ministère uniquement)
// Assurez-vous d'avoir une fonction `getAllUsers` dans votre contrôleur d'utilisateurs
 router.get('/', authenticateToken, authorizeRoles('ministere'), async (req, res) => {
   try {
     const users = await User.findAll({ attributes: { exclude: ['password'] } }); // Exclure le mot de passe
     res.json(users);
   } catch (err) {
     console.error('Erreur lors de la récupération des utilisateurs :', err);
     res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
   }
 });

// Obtenir un utilisateur par ID ou nom d'utilisateur (ministère ou l'utilisateur lui-même)
 router.get('/:idOrUsername', authenticateToken, async (req, res) => {
   try {
     const { idOrUsername } = req.params;
     let user;
     if (isNaN(idOrUsername)) { // Si c'est un nom d'utilisateur
       user = await User.findOne({ where: { username: idOrUsername }, attributes: { exclude: ['password'] } });
     } else { // Si c'est un ID
       user = await User.findByPk(idOrUsername, { attributes: { exclude: ['password'] } });
     }

     if (!user) {
       return res.status(404).json({ message: 'Utilisateur non trouvé' });
     }

     // Autoriser l'accès si c'est le ministère ou l'utilisateur lui-même
     if (req.user.role === 'ministere' || req.user.id === user.id) {
       res.json(user);
     } else {
       res.status(403).json({ message: 'Accès refusé : Non autorisé à voir cet utilisateur' });
     }
   } catch (err) {
     console.error('Erreur lors de la récupération de l\'utilisateur :', err);
     res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
   } });


module.exports = router;
