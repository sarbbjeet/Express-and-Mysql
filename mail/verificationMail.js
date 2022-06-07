const mailer = require("./mailer.index")();
const { mailServer } = require("../config/default");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
//parameters
const {
  EMAIL_VERIFICATION_URL,
  EMAIL_VERIFICATION_TEMPLATE_PATH,
} = require("../utils/contants");

//read html template files
const readFile = async (filePath) => {
  return await fs.readFileSync(filePath, "utf8");
};
module.exports = async (user, code) => {
  const from = mailServer.email_from_addr;
  const source = await readFile(EMAIL_VERIFICATION_TEMPLATE_PATH);
  const template = handlebars.compile(source);
  const localVariables = {
    verify_url: EMAIL_VERIFICATION_URL(code),
    user,
  };
  const mailOptions = {
    from,
    to: user.email,
    subject: "email verification request",
    text: "",
    html: template(localVariables),
  };
  return await mailer.sendMail(mailOptions);
};
