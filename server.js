const server = require("./app");
const db = require("./models");
const config = process.env;

db.sequelize.sync().then(() =>
  server.listen(config.PORT, () => {
    console.log("app running on port ::: " + config.PORT);
  })
);
