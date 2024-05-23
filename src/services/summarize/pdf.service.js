const generativeModel = require('../../configs/vertexAI');
const { functionality, instructions } = require('../../configs/vertexAI/generativeModel.config');

async function summarizePDF(fileUri) {
    const pdf = {
        fileData: {
            mimeType: 'application/pdf',
            fileUri
        }
    };

    const req = {
        contents: [
            { role: 'user', parts: [functionality, pdf, ...instructions] }
        ],
    };

    const streamingResp = await generativeModel.generateContentStream(req);
    const response = await streamingResp.response

    return response;
    // for await (const item of streamingResp.stream) {
    //     process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
    // }

    // process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
}

module.exports = {
    summarizePDF
};
