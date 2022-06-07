const router = require("express").Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const db = require("../../database/db"); //create db connection
const User = require("../../models/User");
const _ = require("lodash");
const sendVerificationMail = require("../../mail/verificationMail");
const verificationMail = require("../../mail/verificationMail");
const auth = require("../../middleware/auth");
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
  next();
});

/* email verify route */
router.get("/email/verify", auth, (req, res) => {
  res.render("templates/auth/resendVerifyEmail.handlebars");
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
    //generate token and send email to the user
    await user.generateEmailVerificationToken();
    //login   ......

    //return res.json(await loginRequest({ email, password }));

    //return res.redirect(`${global.__baseURL}/home`);
    return res.json(_.omit(user, ["password"])); //only password is not send back
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
