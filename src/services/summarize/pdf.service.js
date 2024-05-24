const generativeModel = require('../../configs/vertexAI');
const { instructions } = require('../../configs/vertexAI/generativeModel.config');
const { sendDataToClients } = require('../websocket.service');

async function summarizePDF(fileUri) {
  const pdf = {
    fileData: {
      mimeType: 'application/pdf',
      fileUri,
    },
  };

  const req = {
    contents: [{ role: 'user', parts: [pdf, ...instructions] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    sendDataToClients(item.candidates[0].content.parts[0].text);
  }

  const response = await streamingResp.response;

  const parsedJson = parseJsonText((response.candidates[0].content.parts[0].text));
  sendDataToClients(parsedJson);

  return parsedJson;
}

function parseJsonText(text) {
  const cleanedText = text.replace(/^\`\`\`json\s*|\s*\`\`\`$/g, '');

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    return text;
  }
}

module.exports = {
  summarizePDF,
};
