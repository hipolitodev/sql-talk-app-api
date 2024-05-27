const files = require('../services/files.service');
const validateFile = require('../utils/validateFile.util');
const logger = require('../utils/logger.util');

const acceptedMimeTypes = ['application/pdf'];

const handleFilesUpload = async (req, res) => {
  validateFile(req.file, res, acceptedMimeTypes);

  const fileData = {
    user: req.user.id,
    file: req.file,
  };

  try {
    const fileCreated = await files.create(fileData);
    res.status(201).json({
      status: 201,
      data: fileCreated,
      message: 'File created successfully.',
    });
  } catch (error) {
    const code = 'FILE_PROCESSING_ERROR';
    const message = 'An error occurred while processing the File.';

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

module.exports = { handleFilesUpload };
