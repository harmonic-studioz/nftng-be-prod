const { createOrder } = require("../../controllers/orders");
const { createOrderValidations } = require("./validations");

const orders = require("express").Router();

orders.route("/order").post(createOrderValidations, createOrder);

module.exports = orders;
