const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    //firstly try to get token from cookies and then in the header
    const token = req.cookies["x-auth-token"] || req.header("x-auth-token");
    if (token) {
      req.user = await User.tokenValidate(token);
      //delete req.user.password;
      return next();
    }
    // return res
    //   .status(404)
    //   .json({ success: false, message: `token validation failed` });
  } catch (err) {
    console.log(err.message);
  }
  res.clearCookie("x-auth-token", { path: "/" }); //remove cookies
  return res.redirect("/login"); //redirect to login
};
