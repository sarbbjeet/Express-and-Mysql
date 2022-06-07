const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    const user = await User.tokenValidate(token);
    if (user.id) {
      //verify -> Is user contain user details?
      req.user = user;
      return next();
    }
    return res
      .status(404)
      .json({ success: false, message: `token validation failed` });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};
