const orders = (sequelize, DataTypes) => {
  const orders = sequelize.define("orders", {
    id: {
      primaryKey: true,
      unique: "id",
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    merchandiseItems: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        customValidation: (value) => {
          console.log(this.id);
          value.forEach((item) => {
            const keys = Object.keys(item);
            const allowedKeys = ["merchandiseId", "quantity", "size"];
            for (x of allowedKeys) {
              if (!keys.includes(x)) {
                throw `missing field in merchandiseItems "${x}"`;
              }
            }
            for (x of keys) {
              if (!allowedKeys.includes(x)) {
                throw `invalid key "${x}" found in object`;
              }
            }
          });
        },
      },
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
    countryCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryFee: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
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
