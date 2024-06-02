const listTables = require('./listTables');
const getTable = require('./getTable');
const sqlQuery = require('./sqlQuery');
const getTableForeignKeys = require('./getTableForeignKeys');
const listAllColumns = require('./listAllColumns');
const listTablesRelationships = require('./listTablesRelationships');

const functions = [
  listTables,
  getTable,
  sqlQuery,
  // getTableForeignKeys,
  // listAllColumns,
  // listTablesRelationships,
];

const functionNames = functions.map((f) => f.declaration.name);
const functionDeclarations = functionNames.map(name => ([functions.find((f) => f.declaration.name === name).declaration]));

module.exports = {
  functions,
  functionNames,
  functionDeclarations
}
