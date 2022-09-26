const {
  createOrder,
  handlePayment,
  getOrders,
} = require("../../controllers/orders");
const {
  createOrderValidations,
  getOrdersValidations,
} = require("./validations");

const orders = require("express").Router();

orders.route("/order").post(createOrderValidations, createOrder);
orders.route("/order").get(getOrdersValidations, getOrders);
orders.route("/order/paystack").post(handlePayment);

module.exports = orders;
