const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const functionDeclaration = {
  name: 'get_table_columns',
  description:
    'Get Columns for a Specific Table, To get information about the columns of a specific table.',
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
            SELECT 
                column_name, 
                data_type, 
                is_nullable,
                column_default
            FROM 
                information_schema.columns
            WHERE 
                table_name = '${table_id}';
        `;

    const result = await pool.query(columnQuery);
    return result.rows;
  } catch (error) {
    return error;
  }
};

module.exports = {
  functionDeclaration,
  functionAction,
};
