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
    'events',
    {
      id: { type: 'integer', primaryKey: true, notNull: true },
      user_id: {
        type: 'integer',
        notNull: false,
        references: 'users',
        onDelete: 'SET NULL',
      },
      sequence_number: { type: 'integer', notNull: false },
      session_id: { type: 'string', notNull: false },
      created_at: { type: 'timestamp', notNull: false },
      ip_address: { type: 'string', notNull: false },
      city: { type: 'string', notNull: false },
      state: { type: 'string', notNull: false },
      postal_code: { type: 'string', notNull: false },
      browser: { type: 'string', notNull: false },
      traffic_source: { type: 'string', notNull: false },
      uri: { type: 'string', notNull: false },
      event_type: { type: 'string', notNull: false },
    },
    {
      comment:
        'Programatically generated web events for The Look fictitious e-commerce store',
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('events');
};
