const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), pdfController.handlePDFUpload);

module.exports = router;
