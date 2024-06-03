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
  pgm.createTable(
    'inventory_items',
    {
      id: { type: 'integer', primaryKey: true, notNull: true },
      product_id: {
        type: 'integer',
        notNull: false,
        references: 'products',
        onDelete: 'SET NULL',
      },
      created_at: { type: 'timestamp', notNull: false },
      sold_at: { type: 'timestamp', notNull: false },
      cost: { type: 'float', notNull: false },
      product_category: { type: 'string', notNull: false },
      product_name: { type: 'string', notNull: false },
      product_brand: { type: 'string', notNull: false },
      product_retail_price: { type: 'float', notNull: false },
      product_department: { type: 'string', notNull: false },
      product_sku: { type: 'string', notNull: false },
      product_distribution_center_id: {
        type: 'integer',
        notNull: false,
        references: 'distribution_centers',
        onDelete: 'SET NULL',
      },
    },
    {
      comment:
        'Programatically generated inventory for The Look fictitious e-commerce store',
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('inventory_items');
};
