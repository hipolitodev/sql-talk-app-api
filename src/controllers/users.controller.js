const users = require('../services/users.service');
const { validationResult } = require('express-validator');

const handleUserCreation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send('An error occurred while creating the user.');
    }

    try {
        const summary = await users.create(req.body);
        res.json(summary);
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occurred while creating the user.');
    }
};

module.exports = { handleUserCreation };
