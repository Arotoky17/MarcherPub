const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {
  Sequelize,
  sequelize,
  models: {}
};

const modelDefiners = [
  require('./User'),
  require('./Offer'),
  require('./candidature'),
];

for (const defineModel of modelDefiners) {
  const model = defineModel(sequelize, Sequelize.DataTypes);
  db.models[model.name] = model;
}

db.User = db.models.User;
db.Offer = db.models.Offer;
db.Candidature = db.models.Candidature;

const FOREIGN_KEYS = {
  CANDIDATURE: {
    ENTREPRISE: 'entrepriseId',
    OFFER: 'offerId'
  },
  OFFER: {
    CREATED_BY: 'createdById'
  }
};

function setupAssociations() {
  const { User, Offer, Candidature } = db;

  User.hasMany(Candidature, {
    foreignKey: 'entrepriseId',
    as: 'candidatures'
  });
  Candidature.belongsTo(User, {
    foreignKey: 'entrepriseId',
    as: 'entreprise'
  });

  Offer.hasMany(Candidature, {
    foreignKey: 'offerId',
    as: 'candidatures'
  });
  Candidature.belongsTo(Offer, {
    foreignKey: 'offerId',
    as: 'Offer'
  });

  User.hasMany(Offer, {
    foreignKey: 'createdById',
    as: 'offersCreated'
  });
  Offer.belongsTo(User, {
    foreignKey: 'createdById',
    as: 'creator'
  });
}

setupAssociations();

module.exports = db;
