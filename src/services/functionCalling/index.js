require('dotenv').config();
const generateModel = require('../../../src/configs/vertexAI');
const {
  getTable,
  getTableForeignKeys,
  listAllColumns,
  listTables,
  listTablesRelationships,
  sqlQuery,
} = require('./functions');

const getEnhancedPrompt = (prompt) => {
  return `
You are a data analyst at a large e-commerce company and you have access to their PostgreSQL database.
When asked a question, don't make assumptions about the data, only use the information you learn from the database.
You can ask questions about the database structure, list all the tables, list all columns in the database, list relationships between tables and make SQL queries.

Before crafting your own query make sure all the fields that you are using exists, do not guess o make assumptions about them.
In case of error try again. If you need additional information, ask for it.

${prompt}
`;
};

const startChat = async () => {
  const function_declarations = [
    {
      functionDeclarations: [
        getTable.functionDeclaration,
        getTableForeignKeys.functionDeclaration,
        listAllColumns.functionDeclaration,
        listTables.functionDeclaration,
        listTablesRelationships.functionDeclaration,
        sqlQuery.functionDeclaration,
      ],
    },
  ];

  const model = await generateModel([function_declarations]);
  const chat = await model.startChat();

  return { chat };
};

const parseMessage = (result) => {
  let parts = [];
  const candidate = result?.response?.candidates[0];
  let call;

  if (
    candidate?.content?.parts &&
    Array.isArray(candidate.content?.parts) &&
    candidate.content?.parts.length > 0
  ) {
    let isThereCall = candidate.content?.parts
      .map((part) => part.functionCall)
      .filter(Boolean);
    if (isThereCall.length > 0) {
      call = isThereCall[0];
    }
    let isThereText = candidate.content?.parts
      .map((part) => part.text)
      .filter(Boolean);
    if (isThereText.length > 0) {
      parts = isThereText;
    }
  }
  if (!call) {
    parts = candidate?.content?.parts;
  }

  return { call, parts };
};

const handleFunctionCall = async (call) => {
  let apiResponse;

  const params = {};
  for (const [key, value] of Object.entries(call?.args)) {
    params[key] = value;
  }

  switch (call.name) {
    case 'get_table_columns':
      apiResponse = await getTable.functionAction(params);
      break;
    case 'get_table_foreign_keys':
      apiResponse = await getTableForeignKeys.functionAction(params);
      break;
    case 'get_all_columns_in_database':
      apiResponse = await listAllColumns.functionAction(params);
      break;
    case 'get_all_tables':
      apiResponse = await listTables.functionAction(params);
      break;
    case 'get_relationships_between_tables':
      apiResponse = await listTablesRelationships.functionAction(params);
      break;
    case 'sql_query':
      apiResponse = await sqlQuery.functionAction(params);
      break;
    default:
      break;
  }

  return apiResponse;
};

const processFunctionCalls = async ({
  initialCall,
  chat,
  ws,
  modelMessageData,
}) => {
  let call = initialCall;
  let response;
  let functionCallingInProcess = true;
  const apiRequestsAndResponses = [];

  let startTime = Date.now();
  let callCount = 0;

  while (functionCallingInProcess) {
    callCount++;
    if (callCount > 5) {
      let endTime = Date.now();
      let elapsedTime = endTime - startTime;

      if (elapsedTime < 60000) {
        let delay = 60000 - elapsedTime;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      startTime = Date.now();
      callCount = 0;
    }

    const apiResponse = await handleFunctionCall(call);

    await new Promise((resolve) => setTimeout(resolve, 12000));
    const modelMessage = await chat.sendMessage([
      {
        functionResponse: {
          name: call.name,
          response: {
            content: apiResponse,
          },
        },
      },
    ]);

    const modelMessageParsed = parseMessage(modelMessage);

    apiRequestsAndResponses.push({ call, apiResponse, modelMessageParsed });
    if (modelMessageParsed.parts) {
      if (ws) {
        ws.send(JSON.stringify({
          ...modelMessageData,
          type: "log",
          content: modelMessageParsed.parts,
        }));
      } else {
        console.log(JSON.stringify({ modelUpdate: modelMessageParsed.parts }, null, 2));
      }
    }

    if (modelMessageParsed.call) {
      call = modelMessageParsed.call;
    } else {
      functionCallingInProcess = false;
      response = modelMessageParsed.parts;
    }
  }

  return { response, apiRequestsAndResponses };
};

const sendPrompt = async ({ chat, prompt, ws, modelMessageData }) => {
  const enhancedPrompt = getEnhancedPrompt(prompt);
  const messageResponse = await chat.sendMessage(enhancedPrompt);
  const { call, parts } = parseMessage(messageResponse);
  if (!call) return parts;

  const { response, apiRequestsAndResponses } = await processFunctionCalls({
    initialCall: call,
    chat,
    ws,
    modelMessageData
  });

  return { response, apiRequestsAndResponses };
};

module.exports = {
  startChat,
  sendPrompt,
};

// const test = async () => {
//   const { chat } = await startChat();

//   const prompts = [
//     // "What kind of information is in this database?", // TEST OK
//     // "Give me the names of our distribution centers.", // TEST OK
//     // "What percentage of orders are returned?", // TEST OK
//     // "How is inventory distributed across our regional distribution centers?", // TEST OK
//     // "How many products do we have?" //TEST OK
//     // "Do customers typically place more than one order?", // Unable to process
//     // "Which product categories have the highest profit margins?", // Unable to process
//   ]

//   for (const prompt of prompts) {
//     console.log(JSON.stringify({ prompt }, null, 2));
//     const promptResponse = await sendPrompt({ chat, prompt });
//     console.log(JSON.stringify({ promptResponse }, null, 2));
//   }
// };

// test();
