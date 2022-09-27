const { body, query } = require("express-validator");
const { Op } = require("sequelize");
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
          orderId: null,
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

const getOrdersValidations = [
  query(["from", "to"]).optional({ checkFalsy: true }).isDate(),
  query("page").default(1).toInt().isInt(),
  query("limit").default(10).toInt().isInt(),
  query("reference").optional({ checkFalsy: true }).trim().escape(),
  query("merchandiseName").optional({ checkFalsy: true }).trim().escape(),
];

const getDiscountValidations = [
  body("address")
    .not()
    .isEmpty()
    .isString()
    .custom((value) => {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        throw "invalid wallet address";
      }
      return true;
    }),
  body("amount").default(process.env.discount_amount).toInt().isInt(),
];
module.exports = {
  createOrderValidations,
  getOrdersValidations,
  getDiscountValidations,
};
