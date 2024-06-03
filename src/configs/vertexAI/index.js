const { VertexAI } = require('@google-cloud/vertexai');

const {
  PROJECT_ID,
  LOCATION,
  GOOGLE_APPLICATION_CREDENTIALS,
  TEMPERATURE = 0,
} = process.env;

const vertex_ai = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
});

const generateModel = (tools, functionNames, modelVersion) => {
  const modelName = modelVersion === '1.0' ? "gemini-1.0-pro-001" : "gemini-1.5-pro-001";
  return vertex_ai.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: TEMPERATURE,
    },
    tools,
    // function_calling_config: {
    //   mode: 'ANY',
    //   allowed_function_names: functionNames,
    // },
  });
};

module.exports = { generateModel };
