const files = require('../../services/files.service');
const summarize = require('../../services/summarize');
const validateFile = require('../../utils/validateFile.util');

const acceptedMimeTypes = ['application/pdf'];

const handlePDFSummarize = async (req, res) => {
    validateFile(req.file, res, acceptedMimeTypes);

    const fileData = {
        user: req.user.userId,
        file: req.file,
    }

    try {
        const fileCreated = await files.create(fileData);
        const summary = await summarize.pdf(fileCreated.url);
        res.json(summary);
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occurred while processing the File.');
    }
};

module.exports = { handlePDFSummarize };
