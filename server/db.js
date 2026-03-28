require('dotenv').config();
const mysql = require('mysql2/promise');

function buildConfig() {
  if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);

    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    };
  }

  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'amazon_clone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  };
}

const pool = mysql.createPool(buildConfig());

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getConnection() {
  return pool.getConnection();
}

async function end() {
  await pool.end();
}

module.exports = {
  query,
  getConnection,
  end,
};
