const { body } = require("express-validator");
const db = require("../../models");

const createOrderValidations = [
  body([
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "state",
    "city",
    "town",
    "address",
  ])
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body("email").isEmail(),
  body("phoneNumber").isMobilePhone("en-NG"),
  body("merchandiseItems")
    .isArray()
    .custom(async (value) => {
      await Promise.all(
        value.map(async (item) => {
          const keys = Object.keys(item);
          const allowedKeys = ["merchandiseId", "quantity", "size"];
          for (x of allowedKeys) {
            if (!keys.includes(x)) {
              throw `missing field in merchandiseItems "${x}"`;
            }
          }
          for (x of keys) {
            console.log(x, allowedKeys, keys);
            if (!allowedKeys.includes(x)) {
              throw `invalid key "${x}" found in object`;
            }
          }
          if (
            !(await db.merchandise.findOne({
              where: {
                id: item.merchandiseId,
              },
            }))
          )
            throw `an invalid merchandise found in list`;
        })
      );
      return true;
    }),
  body("discount")
    .optional({ checkFalsy: true })
    .custom(async (value) => {
      const discount = await db.discountToken.findOne({
        where: {
          token: value,
        },
      });
      if (!discount) throw "invalid token";
      return true;
    })
    .customSanitizer(async (value) => {
      const discount = await db.discountToken.findOne({
        where: {
          token: value,
        },
      });
      console.log(discount);
      return discount;
    }),
];

module.exports = {
  createOrderValidations,
};
