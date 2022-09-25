require("dotenv").config();
const express = require("express");
const http = require("http");
const config = process.env;
const helmet = require("helmet");
const db = require("./models");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.middleware");
const route = require("./routes");
const app = express();
const server = http.createServer(app);

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
//>>>>>

app.use("/api", route);

//error handler
app.use(errorHandler);
//>>

db.sequelize.sync().then(() =>
  server.listen(config.PORT, () => {
    console.log("app running on port ::: " + config.PORT);
  })
);

module.exports = app;
