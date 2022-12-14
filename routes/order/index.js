const {
  createOrder,
  handlePayment,
  getOrders,
  checkValidWalletAddressForDiscount,
  deliveryFee,
} = require("../../controllers/orders");
const adminProtect = require("../../middlewares/adminProtect.middleware");
const {
  createOrderValidations,
  getOrdersValidations,
  getDiscountValidations,
  getDeliveryFeeValidations,
} = require("./validations");

const orders = require("express").Router();

orders.route("/order").post(createOrderValidations, createOrder);
orders.route("/order").get(adminProtect, getOrdersValidations, getOrders);
orders
  .route("/order/discount")
  .post(getDiscountValidations, checkValidWalletAddressForDiscount);
orders.route("/order/paystack").post(handlePayment);
orders.route("/order/price").get(getDeliveryFeeValidations, deliveryFee);
module.exports = orders;
