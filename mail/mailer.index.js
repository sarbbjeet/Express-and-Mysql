const nodemailer = require("nodemailer");
const { mailServer } = require("../config/default"); //mail configuration
const mailer = () => {
  //mail server configurations
  let transporter = nodemailer.createTransport({
    host: mailServer.host,
    port: mailServer.port,
    // secure: mailServer.secure,
    auth: {
      user: mailServer.username,
      pass: mailServer.password,
    },
  });
  return {
    sendMail: async function (mailOptions) {
      // console.log(mailOptions);
      //return null;
      return await transporter.sendMail(mailOptions);
    },
  };
};

module.exports = mailer;
