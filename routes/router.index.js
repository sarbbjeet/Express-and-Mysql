const createTables = require("../database/createTables");
const { registerRouter, loginRouter } = require("./auth/auth.index");
module.exports = (app) => {
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/db/createTables", (req, res) => {
    createTables().then(({ success, message }) => {
      if (!success) res.status(404).send({ error: message });
      return res.status(200).send(message);
    });
  });
  app.use("/", (req, res) => {
    res.render("templates/home");
  });
};
