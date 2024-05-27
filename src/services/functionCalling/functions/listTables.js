const pool = require('../../../configs/db.config');
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');

const functionDeclaration = {
    name: "list_tables",
    description: "List tables in a database that will help choose the right table to answer the user's question"
}

const functionAction = async () => {
    try {
        const queryResult = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            AND table_name NOT LIKE 'pg_%'
            AND table_name NOT LIKE '%migration%'
            AND table_name NOT IN ('internal_users', 'chats', 'messages', 'files');
        `);

        const response = {
            tables: queryResult.rows.map(row => row.table_name),
        };

        return response;
    } catch (error) {
        return error;
    }
}

module.exports = {
    functionDeclaration,
    functionAction,
};
