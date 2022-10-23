const { login } = require("../../controllers/admin");

const admin = require("express").Router();

admin.route("/login").post(login);

module.exports = admin;
