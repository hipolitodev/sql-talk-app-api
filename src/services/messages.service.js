const pool = require('../configs/db.config');

const create = async ({ chat_id, user_id, sender, content }) => {
  const result = await pool.query(
    'INSERT INTO messages (chat_id, user_id, sender, content) VALUES ($1, $2, $3, $4) RETURNING *',
    [chat_id, user_id, sender, content],
  );

  return result.rows[0];
};

const getAllChatMessages = async ({ chat_id }) => {
  const result = await pool.query('SELECT * FROM messages WHERE chat_id = $1', [
    chat_id,
  ]);

  return result.rows;
};

module.exports = {
  create,
  getAllChatMessages,
};
