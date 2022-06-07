/* 
get server url address 
*/
const url = require("url");
const config = require("../config/default");

const getUrl = (req, res, next) => {
  //store host url in config
  global.__baseURL = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    // pathname: req.originalUrl,
  });
  return next();
};

module.exports = getUrl;
