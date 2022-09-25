const discountToken = (sequelize, DataTypes) => {
  const discountToken = sequelize.define("discountToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: "id",
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "token",
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
