const { Pool } = require('pg');
const logger = require('../utils/logger.util');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
