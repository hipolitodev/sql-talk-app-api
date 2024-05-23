const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage();

const BUCKET_NAME = process.env.BUCKET_NAME;
const BOOKS_PATH = process.env.BOOKS_PATH;

const upload = async ({ user, file }) => {
    const destFileName = `${BOOKS_PATH}${user}/${file.originalname}`
    const filePath = file.path;

    const options = {
        destination: destFileName,
        preconditionOpts: {},
    };

    console.log({
        filePath,
        destFileName,
        options
    })

    const response = await storage.bucket(BUCKET_NAME).upload(filePath, options);
    return 'id-1234'
}

module.exports = { upload };
