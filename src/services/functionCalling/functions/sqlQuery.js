const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const declaration = {
  name: 'sql_query',
  description:
    'Get information from data in the PostgreSQL database using SQL queries',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      query: {
        type: FunctionDeclarationSchemaType.STRING,
        description:
          "SQL query on a single line that will help give quantitative answers to the user's question when run on a table. In the SQL query, always use the fully qualified table names.",
      },
    },
    required: ['query'],
  },
};

const action = async ({ query }) => {
  try {
    //somethings the query has escapes \\, so we need to remove them
    query = query.replace(/\\/g, '');
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
