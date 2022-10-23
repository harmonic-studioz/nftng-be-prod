const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { admin_email, admin_password } = process.env;
  console.log(admin_password);

  if (email === admin_email && password === admin_password) {
    const token = jwt.sign({ email }, process.env.jwt_key);
    res.send({ token, message: "success" });
  } else {
    throw {
      code: 401,
      message: "'invalid credentials",
    };
  }
});

module.exports = { login };
