const fs = require('fs');
const pdf = require('pdf-parse');

const parse = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    return { data };
};

module.exports = { parse };
