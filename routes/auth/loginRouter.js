const User = require("../../models/User");
const _ = require("lodash");
const router = require("express").Router();
//validation
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const { authCheck } = require("../../middleware/middleware.index");
const navTags = require("../../views/partials/header/navTags");

//middleware
router.use((req, res, next) => {
  next();
});

//create login form
router.get("/", authCheck, (req, res) => {
  if (!req.user)
    return res.render("templates/auth/login", {
      cssFile: "css/login.css",
      navTags: navTags(),
    });
  return res.redirect("/home"); //already login user
});
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validate({ email, password }); //validate
    if (error) throw new Error(error.message);
    const user = await User.checkCredentials({ email, password });
    //  if (!user.email) throw new Error(`user not found`);
    // add token to user token table with user id
    await user.generateToken();
    await user.save();
    res.cookie("x-auth-token", user.rememberToken).redirect("/");
    // res.json(_.omit(user, "password"));
  } catch (err) {
    res.render("templates/auth/login.handlebars", {
      error: true,
      old: {
        email: req.body.email,
        password: req.body.password,
      },
      message: err.message,
      cssFile: "css/login.css",
      navTags: navTags(),
    });
  }
});

//validate credientials
const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  });

  return schema.validate(data);
};

module.exports = router;
