const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files.controller');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/files', upload.single('file'), filesController.handleFilesUpload);

module.exports = router;
