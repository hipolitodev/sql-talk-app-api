/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('products', {
        id: { type: 'integer', primaryKey: true, notNull: true },
        cost: { type: 'float', notNull: false },
        category: { type: 'string', notNull: false },
        name: { type: 'string', notNull: false },
        brand: { type: 'string', notNull: false },
        retail_price: { type: 'float', notNull: false },
        department: { type: 'string', notNull: false },
        sku: { type: 'string', notNull: false },
        distribution_center_id: { type: 'integer', notNull: false, references: '"distribution_centers"', onDelete: 'cascade' },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('products');
};
