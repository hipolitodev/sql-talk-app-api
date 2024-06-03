const {
  startChat,
  sendPrompt,
} = require('../src/services/functionCalling/chat');

const saveResponse = false;
const modelVersion = '1.5';
const websocketData = {
  ws: { send: (data) => console.log(data) },
};

const prompts = [
  'What kind of information is in this database?',
  'What percentage of orders are returned?',
  'How is inventory distributed across our regional distribution centers?',
  'Do customers typically place more than one order?',
  'Which product categories have the highest profit margins?',
];

const chatExample = async () => {
  const promptSelected = 1;
  const { chat } = await startChat();
  const result = await sendPrompt(
    { chat, prompt: prompts[promptSelected], websocketData, modelVersion },
    saveResponse,
  );
  console.log(JSON.stringify({ result }, null, 2));
};

chatExample();
