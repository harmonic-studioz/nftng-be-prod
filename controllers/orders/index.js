const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Orders = require("../../helpers/orders");
const crypto = require("crypto");
const db = require("../../models");
const { paystackSecretKey } = process.env;
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

const handlePayment = asyncHandler(async (req, res) => {
  //validate event
  const hash = crypto
    .createHmac("sha512", paystackSecretKey)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    const { data } = req.body;
    // Do something with event
    if (data.status === "success") {
      //get order id from metadata
      const { orderId } = data.metadata;
      await db.orders.update(
        {
          reference: data.reference,
        },
        {
          where: {
            id: orderId,
          },
        }
      );
      //send mail
    }
  }

  res.send();
});
module.exports = {
  createOrder,
  handlePayment,
};