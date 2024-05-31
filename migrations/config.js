require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL + '?ssl=true',
  migrationsTable: 'pgmigrations',
  dir: './migrations',
  checkOrder: true,
  ignorePattern: 'config.js',
  ssl: {
    rejectUnauthorized: false
  }
};
