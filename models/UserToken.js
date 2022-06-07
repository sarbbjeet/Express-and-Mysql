const dbWraper = require("../database/db");

const createUserTokenTb = `create table user_tokens(
   id int not null auto_increment primary key,
   userId int not null,
   token varchar(255) default null
)`;
module.exports = class UserToken {
  constructor(userId, token) {
    this.userId = userId;
    this.token = token;
  }
  //create user tokens manage table
  createUserTokenTable = async () => {
    await dbWraper(createUserTokenTb);
  };

  static getUserIdByToken = async (token) => {
    const query = `select userId from user_tokens where token = '${token}' limit 1`;
    return await dbWraper(query);
  };
};
