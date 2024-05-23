const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { validateUser } = require('../middlewares/userValidation.middleware');

router.post('/users', validateUser, usersController.handleUserCreation);

module.exports = router;
