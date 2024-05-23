const { VertexAI } = require('@google-cloud/vertexai');

const safetySettings = require('./safetySettings.config');

const model = process.env.MODEL_NAME;
const vertex_ai = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION,
});

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: process.env.MAX_OUTPUT_TOKENS || 1024,
    temperature: process.env.TEMPERATURE || 1,
    topP: process.env.TOP_P || 0.95,
  },
  safetySettings,
});

module.exports = generativeModel;
