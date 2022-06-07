const User = require("../../models/User");
const _ = require("lodash");
const router = require("express").Router();
//validation
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
//middleware
router.use((req, res, next) => {
  // console.log(`middleware`);
  next();
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
    res.json(_.omit(user, "password"));
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
