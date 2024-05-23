const logger = require('../utils/logger.util');

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};

module.exports = { logger: loggerMiddleware };
