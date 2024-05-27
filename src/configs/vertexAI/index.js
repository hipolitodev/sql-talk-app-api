const { VertexAI } = require('@google-cloud/vertexai');

const vertex_ai = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const generateModel = async (tools) => {
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: process.env.MODEL_NAME,
    generationConfig: {
      maxOutputTokens: process.env.MAX_OUTPUT_TOKENS || 1024,
      temperature: process.env.TEMPERATURE || 0,
    },
    tools,
  });

  return generativeModel;
};

module.exports = generateModel;
