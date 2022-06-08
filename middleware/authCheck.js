//check --> Is user login or not
const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    //firstly try to get token from cookies and then in the header
    const token = req.cookies["x-auth-token"] || req.header("x-auth-token");
    if (token) {
      req.user = await User.tokenValidate(token);
      return next();
    }
  } catch (err) {
    // console.log(err.message);
  }
  res.clearCookie("x-auth-token", { path: "/" }); //remove cookies
  return next();
};
