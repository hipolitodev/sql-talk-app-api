const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const functionDeclaration = {
  name: 'get_table_foreign_keys',
  description: "Get Foreign Keys of a Table. To find the foreign keys in a specific table.",
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

const functionAction = async ({ table_id }) => {
  try {
    const columnQuery = `
          SELECT kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '${table_id}';
        `;

    const result = await pool.query(columnQuery);
    return result.rows
  } catch (error) {
    return error;
  }
};

module.exports = {
  functionDeclaration,
  functionAction,
};
