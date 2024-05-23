require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  migrationsTable: 'pgmigrations',
  dir: './migrations',
  checkOrder: true,
  ignorePattern: 'config.js',
};
