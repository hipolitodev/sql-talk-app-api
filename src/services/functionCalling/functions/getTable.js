const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const declaration = {
  name: 'get_table',
  description:
    'Get information about a table, including the description, schema, and number of rows that will help answer the user`s question. Always use the fully qualified table names.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      table_id: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Fully qualified ID of the table to get information about',
      },
    },
    required: ['table_id'],
  },
};

const action = async ({ table_id }) => {
  try {
    const commentQuery = `
            SELECT 
                description AS table_comment
            FROM 
                pg_description
            JOIN 
                pg_class ON pg_class.oid = pg_description.objoid
            WHERE 
                pg_class.relname = '${table_id}'
                AND pg_description.objsubid = 0;
        `;

    const columnQuery = `
            SELECT 
                column_name
            FROM 
                information_schema.columns
            WHERE 
                table_name = '${table_id}'
            ORDER BY 
                ordinal_position;;
        `;

    const resultComment = await pool.query(commentQuery);
    const resultColumns = await pool.query(columnQuery);

    const comment = resultComment.rows[0].table_comment;
    const columns = resultColumns.rows.map((column) => column.column_name);

    return [comment, columns];
  } catch (error) {
    return error;
  }
};

module.exports = {
  declaration,
  action,
};
