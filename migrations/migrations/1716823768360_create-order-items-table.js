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
  pgm.createTable('order_items', {
    id: { type: 'integer', primaryKey: true, notNull: true },
    order_id: {
      type: 'integer',
      notNull: false,
      references: 'orders',
      onDelete: 'SET NULL',
    },
    user_id: {
      type: 'integer',
      notNull: false,
      references: 'users',
      onDelete: 'SET NULL',
    },
    product_id: {
      type: 'integer',
      notNull: false,
      references: 'products',
      onDelete: 'SET NULL',
    },
    inventory_item_id: {
      type: 'integer',
      notNull: false,
      references: 'inventory_items',
      onDelete: 'SET NULL',
    },
    status: { type: 'string', notNull: false },
    created_at: { type: 'timestamp', notNull: false },
    shipped_at: { type: 'timestamp', notNull: false },
    delivered_at: { type: 'timestamp', notNull: false },
    returned_at: { type: 'timestamp', notNull: false },
    sale_price: { type: 'float', notNull: false },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('order_items');
};
