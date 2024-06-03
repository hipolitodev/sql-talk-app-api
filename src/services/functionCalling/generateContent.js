require('dotenv').config();

const messages = require('../messages.service');
const { generateModel } = require('../../configs/vertexAI');
const {
  functionNames,
  functionDeclarations,
  handleFunctionCall,
} = require('./functions');
const {
  delay,
  getUserContent,
  streamResponse,
} = require('../../utils/functionCalling');

const getModel = async (modelVersion) => {
  const tools = [{ functionDeclarations }];
  const model = await generateModel(tools, functionNames, modelVersion);

  return { model, tools };
};

const processPrompt = async ({ contents, model, tools, websocketData, modelVersion }) => {
  let call = null;
  let tokenCount = 0;
  let modelDelay;

  if (modelVersion === '1.0') {
    modelDelay = {
      startTime: Date.now(),
      callCount: 0,
      maxTime: 12000,
      maxCalls: 5,
    };
  } else {
    modelDelay = {
      startTime: Date.now(),
      callCount: 0,
      maxTime: 60000,
      maxCalls: 1,
    };
  }

  do {
    const { response } = await model.generateContent({ contents, tools });
    const modelContent = response?.candidates?.[0]?.content;
    tokenCount += response?.usageMetadata?.totalTokenCount;

    contents.push(modelContent);
    streamResponse(modelContent, websocketData);

    call = modelContent?.parts?.find((part) =>
      Boolean(part.functionCall),
    )?.functionCall;

    if (call) {
      const functionContent = await handleFunctionCall(call);
      contents.push(functionContent);
      streamResponse(functionContent, websocketData);

      // NOTE: wait time caused by model limits on my account, disable if not needed
      modelDelay = await delay(modelDelay, () =>
        streamResponse('Delaying for 60s...', websocketData),
      );
    }
  } while (call);

  return { contents, tokenCount };
};

const generateContent = async (
  { prompt, websocketData, modelVersion },
  saveResponse = true,
) => {
  const userContent = getUserContent(prompt);
  const contents = [userContent];
  const { model, tools } = await getModel(modelVersion);
  const content = await processPrompt({
    contents,
    model,
    tools,
    websocketData,
    modelVersion
  });

  content.contents[0].parts[0].text = prompt;

  if (saveResponse) {
    await messages.create({
      ...websocketData.chatData,
      sender: 'MODEL',
      content,
    });
  }

  return content;
};

module.exports = {
  generateContent,
};
