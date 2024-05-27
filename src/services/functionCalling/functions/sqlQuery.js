const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const functionDeclaration = {
  name: 'sql_query',
  description: 'Get information from tables in PostgreSQL using SQL queries',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      query: {
        type: FunctionDeclarationSchemaType.STRING,
        description:
          "SQL query on a single line that will help give quantitative answers to the user's question when run on a PostgreSQL database and table.",
      },
    },
    required: ['query'],
  },
};

const functionAction = async ({ query }) => {
  try {
    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    return error;
  }
};

module.exports = {
  functionDeclaration,
  functionAction,
};
