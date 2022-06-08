/* 
get server url address 
*/
const url = require("url");
const getUrl = (req, res, next) => {
  //store url in global variable
  global.__baseURL = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    // pathname: req.originalUrl,
  });
  return next();
};

module.exports = getUrl;
