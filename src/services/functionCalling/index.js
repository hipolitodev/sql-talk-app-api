require('dotenv').config();
const generateModel = require('../../../src/configs/vertexAI');
const { getTable, listTables, sqlQuery } = require('./functions');

// const prompts = [
//     "What kind of information is in this database?",
//     "What percentage of orders are returned?",
//     "How is inventory distributed across our regional distribution centers?",
//     "Do customers typically place more than one order?",
//     "Which product categories have the highest profit margins?",
// ]

const getEnhancedPrompt = (prompt) => {
  return `${prompt}
            Please give a concise, high-level summary followed by detail in
            plain language about where the information in your response is
            coming from in the database. Only use information that you learn
            from PostgreSQL, do not make up information.

            You can ask for a list of tables in the database, information
            about a specific table, or run a SQL query to get the information.

            For example, you can ask for the lists of tables in the database,
            and then when you see a table that you want more information about,
            you can ask for information about that table. Then you can ask
            for the information you need from that table by running a SQL query.
    `;
};

const startChat = async () => {
  const function_declarations = [
    {
      functionDeclarations: [
        getTable.functionDeclaration,
        listTables.functionDeclaration,
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
  const call = candidate?.content?.parts[0]?.functionCall;

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
    case 'get_table':
      apiResponse = await getTable.functionAction(params);
      break;
    case 'list_tables':
      apiResponse = await listTables.functionAction(params);
      break;
    case 'sql_query':
      apiResponse = await sqlQuery.functionAction(params);
      break;
    default:
      break;
  }

  return apiResponse;
};

const processFunctionCalls = async ({ initialCall, chat, ws }) => {
  let call = initialCall;
  let response;
  let functionCallingInProcess = true;
  const apiRequestsAndResponses = [];

  while (functionCallingInProcess) {
    const apiResponse = await handleFunctionCall(call);

    const apiMessageResponse = await chat.sendMessage([
      {
        functionResponse: {
          name: call.name,
          response: {
            content: apiResponse,
          },
        },
      },
    ]);

    const apiMessageParsed = parseMessage(apiMessageResponse);

    apiRequestsAndResponses.push({ call, apiResponse, apiMessageParsed });
    ws.send(JSON.stringify({ type: "log", call, apiResponse, apiMessageParsed }));

    if (apiMessageParsed.call) {
      call = apiMessageParsed.call;
    } else {
      functionCallingInProcess = false;
      response = apiMessageParsed.parts;
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
