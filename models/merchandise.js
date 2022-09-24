const merchandise = (sequelize, DataTypes) => {
  const merchandise = sequelize.define("merchandise", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: "id",
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
    },
    sizes: {
      allowNull: false,
      type: DataTypes.JSON,
    },
  });

  merchandise.associate = (model) => {
    merchandise.hasMany(model.images, {
      onDelete: "cascade",
    });
  };

  return merchandise;
};

module.exports = merchandise;
