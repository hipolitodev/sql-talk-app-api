const generativeModel = require('../../configs/vertexAI');
const {
  functionality,
  instructions,
} = require('../../configs/vertexAI/generativeModel.config');

async function summarizePDF(fileUri) {
  const pdf = {
    fileData: {
      mimeType: 'application/pdf',
      fileUri,
    },
  };

  const req = {
    contents: [{ role: 'user', parts: [functionality, pdf, ...instructions] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);
  const response = await streamingResp.response;

  return response.candidates[0].content.parts;
}

module.exports = {
  summarizePDF,
};
