const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null)
    return res.status(401).json({
      status: 401,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials.',
      },
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({
        status: 401,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials.',
        },
      });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
