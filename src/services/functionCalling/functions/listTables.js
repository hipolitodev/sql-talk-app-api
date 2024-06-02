const pool = require('../../../configs/db.config');

const declaration = {
  name: 'list_tables',
  description: 'List tables in a dataset that will help answer the user`s question',
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

    return result.rows.map((row) => row.table_name);
  } catch (error) {
    return error;
  }
};

module.exports = {
  declaration,
  action,
};
