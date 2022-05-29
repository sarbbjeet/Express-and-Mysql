/* access env config file(config() is empty because.env file is 
present in the root directory)  */
require("dotenv").config();
//const mysql = require("mysql");
const mysql = require("mysql2");
// const con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   //   insecureAuth: true,
//   connectionLimit: 10,
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //   insecureAuth: true,
  connectionLimit: 10,
});

// con.connect((err) => {
//   if (err) return console.error(err.message);
//   console.log("connected with database");
// });

module.exports = pool;
