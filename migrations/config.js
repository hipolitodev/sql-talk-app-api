// migrations/config.js
require('dotenv').config();

module.exports = {
    databaseUrl: process.env.DATABASE_URL,
    migrationsTable: 'pgmigrations',
    dir: './migrations', // Ensure this points correctly to where your migration scripts are.
    checkOrder: true,
    ignorePattern: 'config.js' // Ensure to ignore config.js as a migration file.
};
