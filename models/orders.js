const orders = (sequelize, DataTypes) => {
  const orders = sequelize.define("orders", {
    id: {
      primaryKey: true,
      unique: "id",
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
    },
    merchandiseItems: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    town: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
  orders.associate = (model) => {
    orders.hasOne(model.discountToken, {
      onDelete: "cascade",
    });
  };
  return orders;
};
module.exports = orders;
