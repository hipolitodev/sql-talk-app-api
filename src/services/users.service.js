const bcrypt = require('bcryptjs');
const pool = require('../configs/db.config');

const create = async (user) => {
  const { username, name, email, password } = user;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    'INSERT INTO internal_users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, name, email, hashedPassword],
  );

  return newUser.rows[0];
};

const getUser = async (email) => {
  const result = await pool.query(
    'SELECT * FROM internal_users WHERE email = $1',
    [email],
  );

  return result.rows[0];
};

module.exports = {
  create,
  getUser,
};
