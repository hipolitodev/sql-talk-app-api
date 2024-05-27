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
    pgm.sql(`
      INSERT INTO distribution_centers VALUES
      (1, 'Memphis TN', 35.1174, -89.9711),
      (2, 'Chicago IL', 41.8369, -87.6847),
      (3, 'Houston TX', 29.7604, -95.3698),
      (4, 'Los Angeles CA', 34.05, -118.25),
      (5, 'New Orleans LA', 29.95, -90.0667),
      (6, 'Port Authority of New York/New Jersey NY/NJ', 40.634, -73.7834),
      (7, 'Philadelphia PA', 39.95, -75.1667),
      (8, 'Mobile AL', 30.6944, -88.0431),
      (9, 'Charleston SC', 32.7833, -79.9333),
      (10, 'Savannah GA', 32.0167, -81.1167);
    `);
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.sql(`
      DELETE FROM distribution_centers;
    `);
};
