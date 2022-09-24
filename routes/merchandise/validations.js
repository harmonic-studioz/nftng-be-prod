const { body, query, param } = require("express-validator");
const multer = require("multer");
const db = require("../../models");
const createMerchandiseValidations = () =>
  //   console.log(body);
  [
    body("name").not().isEmpty().trim().escape(),
    body("quantity")
      .toInt()
      .isInt()
      .custom((number) => {
        if (number <= 0) {
          throw "quantity cannot be zero or less";
        } else return true;
      }),
    body("sizes")
      .isArray({ min: 1, max: 4 })
      .not()
      .isEmpty()
      .custom((array) => {
        const accepted = ["XL", "XXL", "M", "L"];
        for (x of array) {
          if (!accepted.includes(x.toUpperCase()))
            throw `invalid value "${x.toUpperCase()}"`;
        }
        return true;
      })
      .customSanitizer((array) => {
        return array.map((size) => size.toUpperCase());
      }),
    body("price")
      .toInt()
      .isInt()
      .custom((value) => {
        if (value <= 0) throw "price should be greater than " + value;
        return true;
      }),
    body("merchandiseImages").isArray().not().isEmpty(),
  ];

const getMerchandiseValidations = () => [
  query("limit").default(10).toInt().isInt(),
  query("page").default(1).toInt().isInt(),
  query("all").optional({ checkFalsy: true }).isBoolean().toBoolean(),
  query("name").optional({ checkFalsy: true }).trim().escape(),
];

const updateMerchandiseValidations = () => [
  body("name").optional({ checkFalsy: true }).not().isEmpty().trim().escape(),
  body("quantity")
    .optional({ checkFalsy: true })
    .toInt()
    .isInt()
    .custom((number) => {
      if (number <= 0) {
        throw "quantity cannot be zero or less";
      } else return true;
    }),
  body("sizes")
    .optional({ checkFalsy: true })
    .isArray({ min: 1, max: 4 })
    .not()
    .isEmpty()
    .custom((array) => {
      const accepted = ["XL", "XXL", "M", "L"];
      for (x of array) {
        if (!accepted.includes(x.toUpperCase()))
          throw `invalid value "${x.toUpperCase()}"`;
      }
      return true;
    })
    .customSanitizer((array) => {
      return array.map((size) => size.toUpperCase());
    }),
  body("price")
    .optional({ checkFalsy: true })
    .toInt()
    .isInt()
    .custom((value) => {
      if (value <= 0) throw "price should be greater than " + value;
      return true;
    }),
  merchandiseExist,
  // body("merchandiseImages").isArray().not().isEmpty(),
];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8e6,
    fieldSize: 2e7,
  },
});
const merchandiseExist = param("merchandiseId")
  .not()
  .isEmpty()
  .custom(async (id) => {
    const merchandise = await db.merchandise.findOne({
      where: {
        id,
      },
    });
    if (!merchandise) throw "merchandise does not exist";
  });
module.exports = {
  createMerchandiseValidations,
  upload,
  getMerchandiseValidations,
  updateMerchandiseValidations,
  merchandiseExist,
};
