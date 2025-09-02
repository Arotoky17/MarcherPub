module.exports = (sequelize, DataTypes) => {
  const Candidature = sequelize.define("Candidature", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('en_attente', 'acceptee', 'rejete'),
      allowNull: false,
      defaultValue: 'en_attente'
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entrepriseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    tableName: 'candidatures',
    timestamps: true,
    underscored: true,
  });

  return Candidature;
};
