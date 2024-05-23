const users = require('../services/users.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger.util');

const handleUserCreation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors.array().map(error => ({
                code: "USER_CREATION_ERROR",
                message: `${error.msg} on field ${error.path}.`
            })),
            message: 'An error occurred while creating the user.'
        });
    }

    try {
        const newUser = await users.create(req.body);
        delete newUser.password;
        res.status(201).json({ status: 201, data: newUser, message: "User created successfully." });
    } catch (error) {
        const code = "USER_CREATION_ERROR";
        const message = "An error occurred while creating the user.";

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

module.exports = { handleUserCreation };
