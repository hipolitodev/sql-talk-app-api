const files = require('../../services/files.service');
const summarize = require('../../services/summarize');
const validateFile = require('../../utils/validateFile.util');
const logger = require('../../utils/logger.util');

const acceptedMimeTypes = ['application/pdf'];

const handlePDFSummarize = async (req, res) => {
  validateFile(req.file, res, acceptedMimeTypes);

  const fileData = {
    user: req.user.userId,
    file: req.file,
  };

  try {
    const fileCreated = await files.create(fileData);
    const summary = await summarize.pdf(fileCreated.url);
    res
      .status(200)
      .json({
        status: 200,
        data: summary,
        message: 'Summary created successfully.',
      });
  } catch (error) {
    const code = 'FILE_PROCESSING_ERROR';
    const message = 'An error occurred while processing the PDF.';

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

module.exports = { handlePDFSummarize };
