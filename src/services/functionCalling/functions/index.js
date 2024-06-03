const listTables = require('./listTables');
const getTable = require('./getTable');
const sqlQuery = require('./sqlQuery');
// const getTableForeignKeys = require('./getTableForeignKeys');
// const listAllColumns = require('./listAllColumns');
// const listTablesRelationships = require('./listTablesRelationships');

const functions = [
  listTables,
  getTable,
  sqlQuery,
  // getTableForeignKeys,
  // listAllColumns,
  // listTablesRelationships,
];

const functionNames = functions.map((f) => f.declaration.name);
const functionDeclarations = functionNames.map((name) => [
  functions.find((f) => f.declaration.name === name).declaration,
]);

const handleFunctionCall = async (call) => {
  const functionAction = functions.find(
    (f) => f.declaration.name === call.name,
  );
  if (!functionAction) return;

  const params = Object.assign({}, call.args);
  const content = await functionAction.action(params);

  return {
    role: 'function',
    parts: [
      {
        functionResponse: {
          name: call.name,
          response: {
            content,
          },
        },
      },
    ],
  };
};

module.exports = {
  functions,
  functionNames,
  functionDeclarations,
  handleFunctionCall,
};
