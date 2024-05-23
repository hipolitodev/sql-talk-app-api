
const validateFile = (file, res, acceptedMimeTypes) => {
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!acceptedMimeTypes.includes(file.mimetype)) {
        return res.status(400).send('No file uploaded.')
    }

    return;
}

module.exports = validateFile;
