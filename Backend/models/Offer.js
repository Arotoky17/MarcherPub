module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    domaine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateLimite: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('en_attente', 'valide', 'rejetée'),
      defaultValue: 'en_attente',
      allowNull: false,
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: 'offers',
    timestamps: true,
    underscored: true,
  });

  return Offer;
};
