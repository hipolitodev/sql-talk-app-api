const { VertexAI } = require('@google-cloud/vertexai');

const {
  PROJECT_ID,
  LOCATION,
  GOOGLE_APPLICATION_CREDENTIALS,
  MODEL_NAME,
  TEMPERATURE = 0
} = process.env;

const vertex_ai = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
});

const generateModel = (tools, functionNames) => {
  return vertex_ai.getGenerativeModel({
    model: MODEL_NAME,
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
