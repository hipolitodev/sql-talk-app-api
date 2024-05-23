const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files.controller');

router.post('/files', filesController.handleFilesUpload);

module.exports = router;
