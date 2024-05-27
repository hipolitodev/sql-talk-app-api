const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const functionDeclaration = {
    name: "get_table",
    description: "Get information about a table, including the schema that will help selecting the fields to answer the user's question. Always use the table names.",
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            table_id: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "ID of the table to get information about",
            }
        },
        required: ["table_id"],
    },
}

const functionAction = async ({ table_id }) => {
    try {
        const columnQuery = `
            SELECT 
                table_name, 
                column_name, 
                data_type, 
                character_maximum_length
            FROM 
                information_schema.columns
            WHERE 
                table_name = '${table_id}';
        `;

        const columnResult = await pool.query(columnQuery);

        return {
            columns: columnResult.rows,
        };
    } catch (error) {
        return error;
    }
}

module.exports = {
    functionDeclaration,
    functionAction,
};
