const router = require("express").Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const db = require("../../database/db"); //create db connection
const User = require("../../models/User");
const _ = require("lodash");
const {
  auth,
  verify,
  authCheck,
} = require("../../middleware/middleware.index");
//middleware
const loginRequest = async ({ email, password }) => {
  const response = await axios.post(`${global.__baseURL}/login`, {
    email,
    password,
  });
  return await response.data;
};
router.use((req, res, next) => {
  // console.log(`url = ${req.url}`);
  return next();
});
/* email verify route */
router.get("/email/verify", auth, async (req, res) => {
  try {
    const user = req.user;
    const { code } = req.query; //check for query
    if (code && user) {
      //user sent a request with verification code
      //-->check code validation
      if (await user.validateVerificationCode(code))
        return res.render("templates/email/emailVerificationSuccess");
      return res.render("templates/email/emailVerificationFailed");
    }
    await user.generateEmailVerificationCode();
    return res.render("templates/auth/resendVerifyEmail", {
      success: true,
      message: "Successfully sent verification email",
    });
  } catch (err) {
    return res.render("templates/auth/resendVerifyEmail", {
      error: true,
      message: err.message,
    });
  }
});

//register form
router.get("/", authCheck, async (req, res) => {
  if (!req.user) return res.render("templates/auth/register");
  return res.redirect("/"); //already login user
});

//add user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, isVerified } = req.body;
    const { error } = await validate(req.body);
    if (error) throw new Error(error.message);
    const user = new User();
    user.name = name;
    user.email = email;
    //generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
    user.isVerified = isVerified;
    await user.save(); // -->user is created here
    //login request
    const { rememberToken } = await loginRequest({ email, password });
    //res.header("x-auth-token", rememberToken);
    return res
      .cookie("x-auth-token", rememberToken) //store token in cookies
      .redirect("/register/email/verify");
    //return res.json(_.omit(user, ["password"])); //only password is not send back
  } catch (err) {
    return res.render("templates/auth/register.handlebars", {
      error: true,
      message: err.message,
      old: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    });
  }
});
const validate = async (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    isVerified: Joi.boolean(),
  });
  return await schema.validate(data);
};
module.exports = router;
