const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion réussie à la base Supabase !');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base :', error.message);
  }
})();
