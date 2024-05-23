const { body } = require('express-validator');

exports.validateUser = [
    body('username').isLength({ min: 5 }),
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
];
