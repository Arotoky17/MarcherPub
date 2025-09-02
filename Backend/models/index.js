const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {
  Sequelize,
  sequelize,
  models: {}
};

// Définir les modèles
const modelDefiners = [
  require('./User'),
  require('./Offer'),
  require('./candidature'),
];

for (const defineModel of modelDefiners) {
  const model = defineModel(sequelize, Sequelize.DataTypes);
  db.models[model.name] = model;
}

// Raccourcis
db.User = db.models.User;
db.Offer = db.models.Offer;
db.Candidature = db.models.Candidature;

// Associations
db.User.hasMany(db.Offer, { foreignKey: 'createdById', as: 'offersCreated' });
db.Offer.belongsTo(db.User, { foreignKey: 'createdById', as: 'creator' });

db.User.hasMany(db.Candidature, { foreignKey: 'entrepriseId', as: 'candidatures' });
db.Candidature.belongsTo(db.User, { foreignKey: 'entrepriseId', as: 'entreprise' });

db.Offer.hasMany(db.Candidature, { foreignKey: 'offerId', as: 'candidatures' });
db.Candidature.belongsTo(db.Offer, { foreignKey: 'offerId', as: 'offer' });

module.exports = db;
