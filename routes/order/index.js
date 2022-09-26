const { createOrder, handlePayment } = require("../../controllers/orders");
const { createOrderValidations } = require("./validations");

const orders = require("express").Router();

orders.route("/order").post(createOrderValidations, createOrder);
orders.route("/order/paystack").post(handlePayment);

module.exports = orders;
