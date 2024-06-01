const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const declaration = {
  name: 'list_all_columns_in_database',
  description:
    'Get All Columns in the Database. To get a comprehensive list of all columns in all tables in the database.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      table_id: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'ID of the table to get information about',
      },
    },
    required: ['table_id'],
  },
};

const action = async () => {
  try {
    const result = await pool.query(`
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
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
