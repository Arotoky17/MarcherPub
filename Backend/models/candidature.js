// models/Candidature.js
module.exports = (sequelize, DataTypes) => {
  const Candidature = sequelize.define("Candidature", {
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('en_attente', 'acceptée', 'rejetée'),
      allowNull: false,
      defaultValue: 'en_attente'
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entrepriseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'candidatures',
    timestamps: true,
    underscored: true,
  });

  return Candidature;
};
