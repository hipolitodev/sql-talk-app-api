const express = require('express');
const router = express.Router();
const summarizeController = require('../../controllers/summarize');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post(
  '/summarize/pdf',
  upload.single('file'),
  summarizeController.handlePDFSummarize,
);

module.exports = router;
