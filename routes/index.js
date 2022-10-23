const admin = require("./admin");
const merchandise = require("./merchandise");
const orders = require("./order");

const route = require("express").Router();

route.use(merchandise);
route.use(orders);
route.use("/admin", admin);

module.exports = route;
