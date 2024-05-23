const users = require('../services/users.service');
const { validationResult } = require('express-validator');

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
        console.log(error)
        res.status(500).send('An error occurred while creating the user.');
    }
};

module.exports = { handleUserCreation };
