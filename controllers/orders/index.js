const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Orders = require("../../helpers/orders");

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw {
      status: 400,
      error: errors.array(),
    };

  const orders = await new Orders().createOrder(req.body);
  res.send(orders);
});

module.exports = {
  createOrder,
};
