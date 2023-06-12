const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: process.env.MARIA_DB_HOST,
  user: process.env.MARIA_DB_USER,
  password: process.env.MARIA_DB_PASS,
  port: process.env.MARIA_DB_PORT,
  connectionLimit: 5,
  database: process.env.MARIA_DB_DATABASE,
});

module.exports = pool;
