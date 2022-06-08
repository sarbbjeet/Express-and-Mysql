const dbWraper = require("../database/db");
const crypto = require("crypto");

const emailVerificationTb = `Create table email_verification(
        id int not null auto_increment primary key,
        userId int not null,
        code varchar(255) not null  
     )`;

module.exports = class EmailVerificationCode {
  constructor(userId, code) {
    this.userId = userId;
    this.code = code;
  }
  //create table
  createVerificationCodeTable = async () => {
    await dbWraper(emailVerificationTb);
  };

  static deleteCodeById = async (id) => {
    const query = `DELETE FROM email_verification WHERE id= '${id}'`;
    await dbWraper(query);
  };

  static generateCode = async (id) => {
    const randomCode = crypto.randomBytes(16).toString("hex");
    const query = `INSERT INTO email_verification(userId, code) VALUES (
         '${id}', '${randomCode}')`;
    await dbWraper(query);
    return randomCode;
  };

  static validateCode = async ({ code, userId }) => {
    const query = `select * from email_verification where code = '${code}' and userId = '${userId}' limit 1`;
    const _code = await dbWraper(query);
    if (
      typeof _code[0] !== "undefined" &&
      typeof _code[0].code !== "undefined"
    ) {
      await EmailVerificationCode.deleteCodeById(_code[0].id);
      return true;
    }
    return false;
  };
};
