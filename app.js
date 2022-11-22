require("dotenv").config();
const express = require("express");
const http = require("http");
const helmet = require("helmet");
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
app.use("/template", express.static("./public/template/static"));

//error handler
app.use(errorHandler);
//>>

module.exports = server;
