const promise = require("promise");
const dbWraper = require("../database/db");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const EmailVerificationCode = require("../models/EmailVerificationCode");
const createUserTb = `create table users(
   id int not null auto_increment primary key,
   name varchar(255) not null,
   email varchar(255) not null unique,
   password varchar(255) not null,
   isVerified bool not null default false,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`;

//add remberToken column
const addTokenToUserTable = `Alter table users add column rememberToken varchar(255) default null`;

const { jwt_key } = require("../config/default");
const verificationMail = require("../mail/verificationMail");

class User {
  constructor(user) {
    if (user) {
      const {
        id,
        name,
        email,
        password,
        isVerified,
        rememberToken,
        created_at,
        updated_at,
      } = user;
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.isVerified = isVerified;
      this.rememberToken = rememberToken;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }

  alterUserTable = async () => {
    await dbWraper(addTokenToUserTable);
  };

  //refresh user properties
  refreshUser = async (user) => {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.isVerified = user.isVerified;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.rememberToken = user.rememberToken;
  };

  createTable = () => {
    return new promise((resolve, reject) =>
      db.execute(createUserTb, function (err, result) {
        if (err) return reject({ success: false, message: err.message });
        return resolve({
          success: true,
          message: _.omit(result, ["password"]),
        });
      })
    );
  };

  //insert token to users token table
  insertToken = async () => {
    if (!this.id && !this.rememberToken && this.rememberToken == undefined) {
      throw new Error(`user id or token is missing`);
    }
    const query = `INSERT INTO user_tokens(userId, token) VALUES(
         '${this.id}', '${this.rememberToken} 
      )`;
    await dbWraper(query);
  };

  generateEmailVerificationCode = async ({ expiresIn }) => {
    const randomCode = await EmailVerificationCode.generateCode(
      this.id,
      expiresIn
    );
    await verificationMail({ email: this.email, name: this.name }, randomCode); //send mail
  };
  generateToken = async () => {
    if (!this.id && !this.email)
      throw new Error("token is not created without email or id");
    //generate token
    this.rememberToken = await jwt.sign(
      { id: this.id, email: this.email, created_at: new Date() },
      jwt_key,
      { expiresIn: "30 days" }
    );
    //insert token to user tokens table
    // const query = `INSERT INTO user_tokens(userId, token) VALUES(
    //   '${this.id}', '${this.rememberToken}')`;
    // await dbWraper(query);
  };

  //static method is only accessed by class name
  //find user by email addr
  static findByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email='${email}' limit 1`;
    const users = await dbWraper(query);
    if (users.length > 0) {
      return new User(users[0]);
    }
    throw new Error(`user not found`);
  };

  //find by any properties of user
  static findByOne = async (obj) => {
    const [key, value] = Object.entries(obj)[0];
    const query = `SELECT * FROM users WHERE ${key} = '${value}' limit 1`;
    const users = await dbWraper(query);
    return new User(users[0]);
  };
  //find user by id
  static findById = async (id) => {
    const query = `SELECT * FROM users WHERE id='${id}' limit 1`;
    const users = await dbWraper(query);
    if (users.length > 0) {
      return new User(users[0]);
    }
    throw new Error(`user not found`);
  };

  save = async () => {
    //if id is exist --> update
    //else --> insert new user
    const query = this.id
      ? `UPDATE users SET name = '${this.name}', email = '${this.email}', password = '${this.password}', isVerified = '${this.isVerified}', rememberToken = '${this.rememberToken}' WHERE id = '${this.id}'`
      : `INSERT INTO users(name, email, password, rememberToken) VALUES ( '${this.name}','${this.email}','${this.password}','${this.rememberToken}')`;

    const deleteUser = `DELETE FROM users WHERE email='${this.email}'`;
    await dbWraper(query);
    await this.refreshUser(await User.findByEmail(this.email));
  };

  validateVerificationCode = async (code) => {
    //get code
    const match = await EmailVerificationCode.validateCode({
      code,
      userId: this.id,
    });
    if (match) {
      //update to isVerified --> true
      this.isVerified = 1; //
      await this.save();
    }
    return match;
  };
  //validate token and get user
  static tokenValidate = async (token) => {
    //token table  -->get user id
    const { email } = await jwt.verify(token, jwt_key); //get userId
    //const userId = await UserToken.getUserIdByToken(token);
    return await User.findByEmail(email);
    //return Promise.reject(new Error("token is not valid"));
  };

  //email and password credientials check
  static checkCredentials = async ({ email, password }) => {
    const user = await this.findByEmail(email);
    if (!user.email) throw new Error(`user email not found`);
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("password mismatch");
    return new User(user);
  };
}
module.exports = User;
