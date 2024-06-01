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
  pgm.createTable('orders', {
    order_id: { type: 'integer', primaryKey: true, notNull: true },
    user_id: {
      type: 'integer',
      notNull: false,
      references: 'users',
      onDelete: 'SET NULL',
    },
    status: { type: 'string', notNull: false },
    gender: { type: 'string', notNull: false },
    created_at: { type: 'timestamp', notNull: false },
    returned_at: { type: 'timestamp', notNull: false },
    shipped_at: { type: 'timestamp', notNull: false },
    delivered_at: { type: 'timestamp', notNull: false },
    num_of_item: { type: 'integer', notNull: false },
  }, {
    comment: 'Programatically generated orders for The Look fictitious e-commerce store'
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
