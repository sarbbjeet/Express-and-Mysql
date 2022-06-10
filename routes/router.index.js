const createTables = require("../database/createTables");
const { registerRouter, loginRouter } = require("./auth/auth.index");
const EmailVerificationCode = require("../models/EmailVerificationCode");
module.exports = (app) => {
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/code", async (req, res) => {
    try {
      console.log(
        await EmailVerificationCode.validateCode({
          code: "1f0654151b76a35382b93ecc49b028d2",
          userId: 39,
        })
      );
      //await EmailVerificationCode.verifyExpireOfCode({ expiresIn: "10h" });
      return res.send("helo");
    } catch (err) {
      return res.json({ error: true, message: err.message });
    }

    return res.send("jelo");
  });
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
