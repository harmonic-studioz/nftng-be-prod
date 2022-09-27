const {
  createOrder,
  handlePayment,
  getOrders,
  checkValidWalletAddressForDiscount,
} = require("../../controllers/orders");
const {
  createOrderValidations,
  getOrdersValidations,
  getDiscountValidations,
} = require("./validations");

const orders = require("express").Router();

orders.route("/order").post(createOrderValidations, createOrder);
orders.route("/order").get(getOrdersValidations, getOrders);
orders
  .route("/order/discount")
  .post(getDiscountValidations, checkValidWalletAddressForDiscount);
orders.route("/order/paystack").post(handlePayment);

module.exports = orders;
