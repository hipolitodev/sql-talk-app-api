const files = require('../services/files.service');

const handleFilesUpload = async (req, res) => {
    validateFile(req.file, res);

    const fileData = {
        user: req.user.userId,
        file: req.file,
    }

    try {
        const fileCreated = await files.create(fileData);
        res.json(fileCreated);
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occurred while processing the File.');
    }
};

const validateFile = (file, res) => {
    const acceptedMimeTypes = ['application/pdf'];

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!acceptedMimeTypes.includes(file.mimetype)) {
        return res.status(400).send('No file uploaded.')
    }

    return;
}


module.exports = { handleFilesUpload };
