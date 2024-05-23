const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/auth/login', authController.handleLogin);

module.exports = router;
