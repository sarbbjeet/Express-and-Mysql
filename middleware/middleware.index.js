//add middlewars
module.exports = {
  error: function (req, res, next) {
    return res.json({ success: false, message: "request failed" });
  },
  auth: require("./cookieJwtAuth"),
  verify: require("./verify"),
  authCheck: require("./authCheck"),
};
