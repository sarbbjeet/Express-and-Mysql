/*below global.__baseURL is global variable to get url address,
"getUrl" middleware is used to set value to this variable
*/
const constants = {
  EMAIL_VERIFICATION_URL: (verify_code) => {
    return `${global.__baseURL}/register/email/verify?code=${verify_code}`;
  },
  EMAIL_VERIFICATION_TEMPLATE_PATH: `${global.__basedir}/views/templates/email/email_verification.handlebars`,
};

module.exports = constants;
