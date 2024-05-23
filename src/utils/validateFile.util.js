const validateFile = (file, res, acceptedMimeTypes) => {
  if (!file) {
    return res.status(400).json({
      status: 400,
      error: {
        code: 'NO_FILE_UPLOADED',
        message: 'No file uploaded.',
      },
    });
  }

  if (!acceptedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      status: 400,
      error: {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: 'Unsupported file type. Please upload a valid file.',
      },
    });
  }

  return;
};

module.exports = validateFile;
