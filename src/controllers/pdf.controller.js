const pdf = require('../services/pdf.service');

const handlePDFUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const summary = await pdf.parse(req.file.path);
        res.json(summary);
    } catch (error) {
        res.status(500).send('An error occurred while processing the PDF.');
    }
};

module.exports = { handlePDFUpload };
