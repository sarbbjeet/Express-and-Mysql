const User = require("../models/User");

const usersQuery = `create table users(
  id int not null auto_increment primary key,
  name varchar(255) not null,
  email varchar(255) not null unique,
  password varchar(255) not null,
  isVerified bool not null default false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
const emailVerificationToken = `create table emailVerificationToken
(
id int not null auto_increment primary key,
userId int default null,
token VARCHAR(255) default null,
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
)`;

const db = require("./db");
const createTables = async () => {
  //create users create
  let user = new User();
  user.name = "sinhg";
  user.email = "sarb@gmail.com";
  user.password = "72897";
  user.isVerified = false;
  return user.save();
};

module.exports = createTables;
