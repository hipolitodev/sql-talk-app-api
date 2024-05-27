const pool = require('../configs/db.config');

const create = async ({ user_id }) => {
  const result = await pool.query(
    'INSERT INTO chats (user_id) VALUES ($1) RETURNING *',
    [user_id],
  );

  return result.rows[0];
};

const getAllByUser = async ({ user_id }) => {
  const result = await pool.query('SELECT * FROM chats WHERE user_id = $1', [
    user_id,
  ]);

  return result.rows;
};

module.exports = {
  create,
  getAllByUser,
};
