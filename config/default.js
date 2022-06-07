/* access env config file(config() is empty because.env file is 
present in the root directory)  */
require("dotenv").config();
const config = {
  jwt_key: process.env.JWT_KEY,
  http_port: process.env.HTTP_PORT,
  https_port: process.env.HTPPS_PORT,
  mailServer: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: true,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    email_from_addr: process.env.EMAIL_FROM_ADDR,
  },
};

module.exports = config;
