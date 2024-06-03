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

const startChat = async () => {
  const tools = [{ functionDeclarations }];
  const model = await generateModel(tools, functionNames);
  const chat = await model.startChat(tools);

  return { chat };
};

const processPrompt = async ({ prompt, chat, websocketData }) => {
  let call = null;
  let tokenCount = 0;
  let message = getEnhancedPrompt(prompt);
  let contents = [getUserContent(prompt)];

  let modelDelay = {
    startTime: Date.now(),
    callCount: 1,
    maxTime: 60000,
    maxCalls: 1,
  };

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
  { chat, prompt, websocketData },
  saveResponse = true,
) => {
  const content = await processPrompt({
    prompt,
    chat,
    websocketData,
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
