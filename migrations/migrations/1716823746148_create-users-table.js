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
  pgm.createTable('users', {
    id: { type: 'integer', primaryKey: true, notNull: true },
    first_name: { type: 'string', notNull: false },
    last_name: { type: 'string', notNull: false },
    email: { type: 'string', notNull: false },
    age: { type: 'integer', notNull: false },
    gender: { type: 'string', notNull: false },
    state: { type: 'string', notNull: false },
    street_address: { type: 'string', notNull: false },
    postal_code: { type: 'string', notNull: false },
    city: { type: 'string', notNull: false },
    country: { type: 'string', notNull: false },
    latitude: { type: 'float', notNull: false },
    longitude: { type: 'float', notNull: false },
    traffic_source: { type: 'string', notNull: false },
    created_at: {
      type: 'timestamp',
      notNull: false,
      default: pgm.func('current_timestamp'),
    },
  }, {
    comment: 'Programatically generated users for The Look fictitious e-commerce store'
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('users');
};
