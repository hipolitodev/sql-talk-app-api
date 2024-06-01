const pool = require('../../../configs/db.config');

const declaration = {
  name: 'get_all_tables',
  description: 'To get a list of all tables in the database.',
};

const action = async () => {
  try {
    const result = await pool.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_name NOT LIKE 'pg_%'
          AND table_name NOT LIKE '%migration%'
          AND table_name NOT IN ('internal_users', 'chats', 'messages', 'files');
        `);

    return result.rows;
  } catch (error) {
    return error;
  }
};

module.exports = {
  declaration,
  action,
};
