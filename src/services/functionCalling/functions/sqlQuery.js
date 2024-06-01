const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const declaration = {
  name: 'sql_query',
  description: 'Get information from tables in PostgreSQL using SQL queries',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      query: {
        type: FunctionDeclarationSchemaType.STRING,
        description:
          "Standard SQL query to get information from tables in PostgreSQL. Example: SELECT * FROM table_name WHERE column_name = 'value';",
      },
    },
    required: ['query'],
  },
};

const action = async ({ query }) => {
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    return error;
  }
};

module.exports = {
  declaration,
  action,
};
