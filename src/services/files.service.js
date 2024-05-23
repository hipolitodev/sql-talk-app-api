const { Storage } = require('@google-cloud/storage');
const pool = require('../configs/db.config');

const storage = new Storage();

const BUCKET_NAME = process.env.BUCKET_NAME;
const FILES_PATH = process.env.FILES_PATH;

const upload = async ({ user, file }) => {
    const destFileName = `${FILES_PATH}${user}/${file.originalname}`
    const filePath = file.path;

    const options = {
        destination: destFileName,
        preconditionOpts: {},
    };

    // const response = await storage.bucket(BUCKET_NAME).upload(filePath, options);

    return response;
}

const create = async (data) => {
    const uploadedFile = await upload(data);

    const result = await pool.query(
        'INSERT INTO files (url) VALUES ($1) RETURNING *',
        [uploadedFile[1].selfLink]
    );


    return result.rows[0];
}

module.exports = {
    upload,
    create,
};
