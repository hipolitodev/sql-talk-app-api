const pool = require('../../../configs/db.config');

const functionDeclaration = {
  name: 'list_relationships_between_tables',
  description:
    'Relationships Between Tables. To find relationships between tables, such as foreign key references.',
};

const functionAction = async () => {
  try {
    const result = await pool.query(`
        SELECT 
        tc.table_schema, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
        FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY'
        AND tc.table_name NOT LIKE 'pg_%'
        AND tc.table_name NOT LIKE '%migration%'
        AND tc.table_name NOT IN ('internal_users', 'chats', 'messages', 'files');
        `);

    return result.rows;
  } catch (error) {
    return error;
  }
};

module.exports = {
  functionDeclaration,
  functionAction,
};
