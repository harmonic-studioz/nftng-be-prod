const { body } = require("express-validator");
const {
  createMerchandise,
  imageUpload,
  getMerchandise,
  updateMerchandise,
  getSingleMerchandise,
  deleteMerchandise,
} = require("../../controllers/merchandise");
const adminProtect = require("../../middlewares/adminProtect.middleware");
const {
  createMerchandiseValidations,
  upload,
  getMerchandiseValidations,
  updateMerchandiseValidations,
  merchandiseExist,
} = require("./validations");

const merchandise = require("express").Router();

merchandise
  .route("/merchandise")
  .post(adminProtect, createMerchandiseValidations(), createMerchandise)
  .get(getMerchandiseValidations(), getMerchandise);
merchandise
  .route("/merchandise/:merchandiseId")
  .patch(adminProtect, updateMerchandiseValidations(), updateMerchandise)
  .get(merchandiseExist, getSingleMerchandise)
  .delete(adminProtect, merchandiseExist, deleteMerchandise);

merchandise.route("/uploads").post(upload.array("images"), imageUpload);
module.exports = merchandise;
