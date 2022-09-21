const express = require("express");
const http = require("http");
const env = process.env.NODE_ENV;
const config = require("./config.json")[env];
const helmet = require("helmet");
const db = require("./models");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.middleware");
const app = express();
const server = http.createServer(app);

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
//>>>>>

//error handler
app.use(errorHandler);
//>>

db.sequelize.sync().then(() =>
  server.listen(config.port, () => {
    console.log("app running on port ::: " + config.port);
  })
);
