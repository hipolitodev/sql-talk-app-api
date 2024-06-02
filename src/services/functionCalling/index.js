require('dotenv').config();

const vertexAI = require('../../../src/configs/vertexAI');
const { functions, functionNames, functionDeclarations } = require('./functions');
const messages = require('../messages.service');

const getEnhancedPrompt = (prompt) => {
  return `
You are a data engineer at a large e-commerce company and your job is to analyze the PostgreSQL database.
When asked a question, don't make assumptions about the data, only use the information you learn from the database.
You can ask questions about the database structure, list all the tables, list all columns in the database, list relationships between tables and make SQL queries.

Before crafting your own query make sure all the fields that you are using exist, do not guess o make assumptions about them.
In case of error try again. If you need additional information, ask for it.

${prompt}
`;
};

const startChat = async () => {
  const tools = [{ functionDeclarations }];
  const model = await vertexAI.generateModel(tools, functionNames);
  const chat = await model.startChat();

  return { chat };
};

const parseModelResponse = (result) => {
  const candidate = result?.response?.candidates?.[0];
  const parts = candidate?.content?.parts;
  let call, text;

  if (Array.isArray(parts)) {
    call = parts.find(part => Boolean(part.functionCall))?.functionCall;
    text = parts.find(part => Boolean(part.text))?.text;
  }

  return { call, text };
}

const handleFunctionCall = async (call) => {
  const functionAction = functions.find((f) => f.declaration.name === call.name);
  if (!functionAction) return;

  const params = Object.assign({}, call.args);
  const content = await functionAction.action(params);

  return {
    role: 'function',
    parts: [
      {
        functionResponse: {
          name: call.name,
          response: {
            content
          }
        }
      }
    ],
  }
};

const delayModelUsage = async (startTime, callCount) => {
  callCount++
  const maxTime = 61000;
  const maxCalls = 5;

  if (callCount > maxCalls) {
    let endTime = Date.now();
    let elapsedTime = endTime - startTime;

    if (elapsedTime < maxTime) {
      let delay = maxTime - elapsedTime;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return { callCount: 0, startTime: Date.now() };
  }

  return { callCount, startTime };
}

const streamResponse = async (websocketData, text) => {
  if (text) {
    if (websocketData?.ws) {
      ws.send(JSON.stringify({
        ...chatData,
        type: "websocketData",
        content: text,
      }));
    } else {
      console.log(JSON.stringify({ modelUpdate: text }, null, 2));
    }
  }
}

const processFunctionCalls = async ({
  call,
  chat,
  websocketData,
}) => {
  let data = { call, text: "" }
  let delayData = { startTime: Date.now(), callCount: 0 }
  const apiRequestsAndResponses = [];
  let response;

  do {
    delayData = await delayModelUsage(delayData.startTime, delayData.callCount); // Model limits 5 calls per minute, comment this line to disable

    const functionResponse = await handleFunctionCall(call);
    const modelResponse = await chat.sendMessage([{ functionResponse }]);

    const responses = { api: { ...call, ...functionResponse }, model: modelResponse }
    apiRequestsAndResponses.push(responses);
    data = parseModelResponse(modelResponse);

    response = data.text;
    call = data.call;

    if (call) streamResponse(websocketData, data.text)
  } while (call);

  return { response, apiRequestsAndResponses };
};

const sendPrompt = async ({ chat, prompt, websocketData }) => {
  const enhancedPrompt = getEnhancedPrompt(prompt);
  const modelResponse = await chat.sendMessage(enhancedPrompt);
  const { call, text } = parseModelResponse(modelResponse);

  if (text) streamResponse(websocketData, text)

  const content = call
    ? await processFunctionCalls({ call, chat, websocketData })
    : { model: modelResponse };

  // await messages.create({
  //   ...websocketData.chatData,
  //   content,
  // });

  return content;
};

module.exports = {
  startChat,
  sendPrompt,
};

// const test = async () => {
//   const { chat } = await startChat();

//   const prompts = [
//     "What kind of information is in this database?", // TEST OK
//     "Give me the names of our distribution centers.", // TEST OK
//     // "What percentage of orders are returned?", // TEST OK
//     // "How is inventory distributed across our regional distribution centers?", // TEST OK
//     // "How many products do we have?" //TEST OK
//     // "Do customers typically place more than one order?", // Unable to process
//     // "Which product categories have the highest profit margins?", // Unable to process
//   ]

//   for (const prompt of prompts) {
//     console.log(JSON.stringify({ prompt }, null, 2));
//     const { response } = await sendPrompt({ chat, prompt });
//     console.log(JSON.stringify({ response }, null, 2));
//     // wait for 1 minute
//     await new Promise((resolve) => setTimeout(resolve, 60000));
//   }
// };
JSON.stringify({ content: 'What kind of information is in this database' })