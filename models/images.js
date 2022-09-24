const images = (sequelize, DataTypes) => {
  const images = sequelize.define("images", {
    id: {
      unique: "id",
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      unique: "url",
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  });

  images.associate = (model) => {
    images.belongsTo(model.merchandise, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: true,
      },
    });
  };
  return images;
};

module.exports = images;
