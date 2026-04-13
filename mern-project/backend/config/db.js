const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "mern_auth_db"
});

module.exports = pool.promise();