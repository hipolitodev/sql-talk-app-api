const { Pool } = require('pg');
const logger = require('../utils/logger.util');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return logger.error({
      message: 'Error acquiring client' + err.stack,
    });
  }
  client.query('SELECT NOW()', (err) => {
    release();
    if (err) {
      return logger.error({
        message: 'Error executing query' + err.stack,
      });
    }
    return logger.info({
      message: 'Connected to PostgreSQL...',
    });
  });
});

module.exports = pool;
