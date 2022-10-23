const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const adminProtect = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw {
      code: 401,
      message: "No token found!",
    };
  }
  if (!authorization.toLocaleLowerCase().includes("bearer")) {
    throw {
      code: 401,
      message: "invalid authorization headers",
    };
  }
  const result = jwt.verify(authorization.split(" ")[1], process.env.jwt_key);
  next();
});

module.exports = adminProtect;
