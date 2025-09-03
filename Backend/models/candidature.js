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
      type: DataTypes.ENUM("en_attente", "acceptée", "rejetée"),
      allowNull: false,
      defaultValue: "en_attente",
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
    },
  }, {
    tableName: "candidatures",
    timestamps: true,
    underscored: true,
  });

  // ✅ Définition des associations
  Candidature.associate = (models) => {
    // Une candidature appartient à une offre
    Candidature.belongsTo(models.Offer, {
      foreignKey: "offerId",
      as: "offer",   // 👈 alias défini ici
    });

    // Une candidature appartient à une entreprise (User avec rôle entreprise)
    Candidature.belongsTo(models.User, {
      foreignKey: "entrepriseId",
      as: "entreprise",
    });
  };

  return Candidature;
};
