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
  getEnhancedPrompt,
  getUserContent,
  streamResponse,
} = require('../../utils/functionCalling');

const startChat = async (modelVersion) => {
  const tools = [{ functionDeclarations }];
  const model = await generateModel(tools, functionNames, modelVersion);
  const chat = await model.startChat(tools);

  return { chat };
};

const processPrompt = async ({ prompt, chat, websocketData, modelVersion }) => {
  let modelDelay;
  let call = null;
  let tokenCount = 0;
  let message = getEnhancedPrompt(prompt);
  const userContent = getUserContent(prompt);
  userContent.parts[0].text = prompt;
  const contents = [userContent];

  if (modelVersion === '1.0') {
    modelDelay = {
      startTime: Date.now(),
      callCount: 0,
      maxTime: 12100,
      maxCalls: 5,
    };
  } else {
    modelDelay = {
      startTime: Date.now(),
      callCount: 0,
      maxTime: 61000,
      maxCalls: 1,
    };
  }

  do {
    const { response } = await chat.sendMessage(message);

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

      const functionResponse = functionContent?.parts.find((part) =>
        Boolean(part.functionResponse),
      )?.functionResponse;
      message = [{ functionResponse }];

      // NOTE: wait time caused by model limits on my account, disable if not needed
      modelDelay = await delay(modelDelay, () =>
        streamResponse('Delaying for 60s...', websocketData),
      );
    }
  } while (call);

  return { contents, tokenCount };
};

const sendPrompt = async (
  { chat, prompt, websocketData, modelVersion },
  saveResponse = true,
) => {
  const content = await processPrompt({
    prompt,
    chat,
    websocketData,
    modelVersion
  });

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
  startChat,
  sendPrompt,
};
