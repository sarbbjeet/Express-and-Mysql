const dbWraper = require("../database/db");
const crypto = require("crypto");
const moment = require("moment");

const emailVerificationTb = `Create table email_verification(
        id int not null auto_increment primary key,
        userId int not null,
        code varchar(255) not null  
     )`;
const addMoreColumn = `Alter table email_verification 
add column expiresIn varchar(255) default null, 
add column created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
add column updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`;

module.exports = class EmailVerificationCode {
  constructor(userId, code) {
    this.userId = userId;
    this.code = code;
  }
  static createMoreColumns = async () => {
    await dbWraper(addMoreColumn);
  };
  //create table
  createVerificationCodeTable = async () => {
    await dbWraper(emailVerificationTb);
  };

  static deleteCodeById = async (id) => {
    const query = `DELETE FROM email_verification WHERE id= '${id}'`;
    await dbWraper(query);
  };
  static deleteCodeByOne = async (obj) => {
    const keys = Object.keys(obj);
    console.log(keys);
    if (!keys) throw new Error("wrong wrong key or value");
    const query = `DELETE FROM email_verification WHERE ${keys[0]}= '${
      obj[keys[0]]
    }'`;
    await dbWraper(query);
  };

  static generateCode = async (id, expiresIn) => {
    const randomCode = crypto.randomBytes(16).toString("hex");
    const query = `INSERT INTO email_verification(userId, code, expiresIn) VALUES (
         '${id}', '${randomCode}', '${expiresIn}')`;
    await dbWraper(query);
    return randomCode;
  };

  static verifyExpireOfCode = async ({ expiresIn, created_at }) => {
    let expiresTimeInMin = 0;
    if (expiresIn.endsWith("h") || expiresIn.endsWith("hours")) {
      expiresTimeInMin =
        Number(expiresIn.split("h")[0] || expiresIn.split("hours")[0]) * 60; //convert hour into minutes
      //const date = new Date(created_at);
      // console.log("created_at =", Math.round(date.valueOf() / 60000)); //total minutes
      // console.log("current_at =", Math.round(Date.now().valueOf() / 60000));
      // console.log(moment().diff(created_at, "minutes"));
      //   console.log(expiresTimeInMin);
    } else if (expiresIn.endsWith("days")) {
      expiresTimeInMin = Number(expiresIn.split("days")[0]) * 24 * 60; //convert days into minutes
    } else if (expiresIn.endsWith("min") || expiresIn.endsWith("minutes")) {
      expiresTimeInMin = Number(
        expiresIn.split("min")[0] || expiresIn.split("minutes")[0]
      );
    }
    return expiresTimeInMin < moment().diff(created_at, "minutes");
  };

  static validateCode = async ({ code, userId }) => {
    const query = `select * from email_verification where code = '${code}' and userId = '${userId}' limit 1`;
    const _code = await dbWraper(query);
    if (
      typeof _code[0] !== "undefined" &&
      typeof _code[0].code !== "undefined"
    ) {
      //await EmailVerificationCode.deleteCodeById(_code[0].id);
      await EmailVerificationCode.deleteCodeByOne({ userId: _code[0].userId });
      if (await EmailVerificationCode.verifyExpireOfCode(_code[0]))
        return false; //expired code
      //not expired code yet
      return true;
    }
    return false;
  };
};
