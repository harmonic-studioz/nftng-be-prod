const merchandise = require("./merchandise");

const route = require("express").Router();

route.use(merchandise);

module.exports = route;
