const auth = require('../services/auth.service');
const users = require('../services/users.service');
const logger = require('../utils/logger.util');

const handleLogin = async (req, res) => {
  try {
    const user = await users.getUser(req.body.email);
    if (!user)
      return res.status(401).json({
        status: 401,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials.',
        },
      });

    const token = await auth.login(user, req.body.password);
    if (!token)
      return res.status(401).json({
        status: 401,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials.',
        },
      });

    res.status(200).json({
      status: 200,
      data: { token },
      message: 'User logged in successfully.',
    });
  } catch (error) {
    const code = 'LOGIN_ERROR';
    const message = 'An error occurred while logging in.';

    logger.error({
      code,
      message: error.message || error || message,
    });
    res.status(500).json({
      status: 500,
      error: {
        code,
        message,
      },
    });
  }
};

module.exports = { handleLogin };
