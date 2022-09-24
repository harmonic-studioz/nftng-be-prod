const discountToken = (sequelize, DataTypes) => {
  const discountToken = sequelize.define("discountToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      unique: "id",
    },
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
      defaultValue: "FIXED",
    },
  });
  discountToken.associate = (model) => {
    discountToken.belongsTo(model.orders, {
      onDelete: "cascade",
    });
  };
  return discountToken;
};
module.exports = discountToken;
