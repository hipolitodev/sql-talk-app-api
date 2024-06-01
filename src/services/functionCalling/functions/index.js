const getTable = require('./getTable');
const getTableForeignKeys = require('./getTableForeignKeys');
const listAllColumns = require('./listAllColumns');
const listTables = require('./listTables');
const listTablesRelationships = require('./listTablesRelationships');
const sqlQuery = require('./sqlQuery');

const functions = [
  getTable,
  getTableForeignKeys,
  listAllColumns,
  listTables,
  listTablesRelationships,
  sqlQuery,
];

const functionNames = functions.map((f) => f.declaration.name);
const functionDeclarations = functionNames.map(name => ([functions.find((f) => f.declaration.name === name).declaration]));

module.exports = {
  functions,
  functionNames,
  functionDeclarations
}
