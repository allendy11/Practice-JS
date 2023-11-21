const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2");

if (process.env.NODE_ENV == "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env.production") });
} else if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: path.join(__dirname, "../../.env.development") });
}

const mysqlOption = {
  host: "localhost",
  user: "root",
  password: "1231",
  database: "testdb",
  // connectionLimit: "",
  // socketPath: process.env.MYSQL_SOCKET_PATH,
  // ssl: {
  //   rejectUnauthorized: false,
  //   // key: fs.readFileSync(process.env.SSL_KEY_PATH),
  //   // cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  // },
  // timezone: "+00:00",
};

const db = mysql.createPool({ ...mysqlOption });

module.exports = {
  mysqlOption,
  db,
};
