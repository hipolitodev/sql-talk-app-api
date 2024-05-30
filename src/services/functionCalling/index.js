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

// const prompts = [
//     "What kind of information is in this database?",
//     "What percentage of orders are returned?",
//     "How is inventory distributed across our regional distribution centers?",
//     "Do customers typically place more than one order?",
//     "Which product categories have the highest profit margins?",
// ]

const getEnhancedPrompt = (prompt) => {
  return `
You are a data analyst at a large e-commerce company. 
The company has a PostgreSQL database that contains information.
You have access to the database and can run queries to get the
information you need. 
Don't make assumptions about the data, only use the information
you learn from the database.
${prompt}
Before making a query, you should list the tables, choose the right one(s), and then list the columns, foreign keys, or relationships.
And only then, when you fully understand the database structure, you can make a query. In case of error try again.
If you need additional information, ask for it.
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

  if (candidate?.content?.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
    isThereCall = candidate.content.parts.map(part => part.functionCall).filter(Boolean);
    if (isThereCall.length > 0) {
      call = isThereCall[0];
    }
    isThereText = candidate.content.parts.map(part => part.text).filter(Boolean);
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
    case 'list_all_columns_in_database':
      apiResponse = await listAllColumns.functionAction(params);
      break;
    case 'list_all_tables':
      apiResponse = await listTables.functionAction(params);
      break;
    case 'list_relationships_between_tables':
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

const processFunctionCalls = async ({ initialCall, chat, ws, modelMessage }) => {
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
        await new Promise(resolve => setTimeout(resolve, delay));
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
      ws.send(JSON.stringify({
        ...modelMessage,
        content: modelMessageParsed.parts
      }));
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

const sendPrompt = async ({ chat, prompt, ws }) => {
  const enhancedPrompt = getEnhancedPrompt(prompt);
  const messageResponse = await chat.sendMessage(enhancedPrompt);
  const { call, parts } = parseMessage(messageResponse);
  if (!call) return parts;

  const { response, apiRequestsAndResponses } = await processFunctionCalls({
    initialCall: call,
    chat,
    ws
  });

  return { response, apiRequestsAndResponses };
};

module.exports = {
  startChat,
  sendPrompt,
};

// const test = async () => {
//   // const prompt = prompts[3];
//   const { chat } = await startChat();

//   const initialPrompt = 'What kind of information is in this database?';
//   console.log(JSON.stringify({ initialPrompt }, null, 2));
//   const initialResponse = await sendPrompt({ chat, prompt: initialPrompt });
//   console.log(JSON.stringify({ initialResponse }, null, 2));

//   const followingPrompt = 'give me information about the orders table';
//   console.log(JSON.stringify({ followingPrompt }, null, 2));
//   const followingResponse = await sendPrompt({ chat, prompt: followingPrompt });
//   console.log(JSON.stringify({ followingResponse }, null, 2));

//   const followingPrompt2 = 'how many order did the user with id 67';
//   console.log(JSON.stringify({ followingPrompt2 }, null, 2));
//   const followingResponse2 = await sendPrompt({
//     chat,
//     prompt: followingPrompt2,
//   });
//   console.log(JSON.stringify({ followingResponse2 }, null, 2));
// };

// JSON.stringify({
//   chatId: '550cdd31-bbe6-4d5f-9293-75da740ef59b',
//   content: 'What kind of information is in this database?',
// });
