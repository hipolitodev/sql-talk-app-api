const getTable = require('./getTable');
const getTableForeignKeys = require('./getTableForeignKeys');
const listAllColumns = require('./listAllColumns');
const listTables = require('./listTables');
const listTablesRelationships = require('./listTablesRelationships');
const sqlQuery = require('./sqlQuery');

module.exports = {
  getTable,
  getTableForeignKeys,
  listAllColumns,
  listTables,
  listTablesRelationships,
  sqlQuery,
};
