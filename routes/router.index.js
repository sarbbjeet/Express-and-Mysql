const authRouters = require("./auth/loginRoutes");
module.exports = (app) => {
  app.use("/auth", authRouters);
};
