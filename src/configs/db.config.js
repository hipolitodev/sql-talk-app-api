const { Pool } = require('pg');
const logger = require('../utils/logger.util');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bookworm',
    password: 'password',
    port: 5432,
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
