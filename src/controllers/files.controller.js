const files = require('../services/files.service');
const validateFile = require('../utils/validateFile.util');

const acceptedMimeTypes = ['application/pdf'];

const handleFilesUpload = async (req, res) => {
    validateFile(req.file, res, acceptedMimeTypes);

    const fileData = {
        user: req.user.userId,
        file: req.file,
    }

    try {
        const fileCreated = await files.create(fileData);
        res.status(201).json({ status: 201, data: fileCreated, message: "File created successfully." });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            error: {
                code: "FILE_PROCESSING_ERROR",
                message: "An error occurred while processing the File.",
            },
        });
    }
};

module.exports = { handleFilesUpload };
