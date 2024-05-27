const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');
const { startChat, sendPrompt } = require('../services/functionCalling/index');

const wss = new WebSocket.Server({ port: 8080 });
console.log('Starting WebSocket server');

wss.on('connection', (ws) => {
  console.log('A new client connected');

  ws.isAuthenticated = false;

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'auth') {
      const token = data.token;
      if (!token) {
        ws.send(
          JSON.stringify({
            type: 'auth',
            success: false,
            message: 'Token is required',
          }),
        );
        ws.close(1008, 'Token is required');
        return;
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          ws.send(
            JSON.stringify({
              type: 'auth',
              success: false,
              message: 'Invalid token',
            }),
          );
          ws.close(1008, 'Invalid token');
          return;
        }

        ws.user = user;
        ws.isAuthenticated = true;
        ws.send(
          JSON.stringify({
            type: 'auth',
            success: true,
            message: 'Authentication successful',
          }),
        );
        console.log(`User ${user.id} authenticated successfully`);
      });
    } else if (ws.isAuthenticated) {
      await handleIncomingMessage(ws, data);
    } else {
      ws.send(JSON.stringify({ error: 'Authentication required' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const handleIncomingMessage = async (ws, message) => {
  try {
    const { chatId, content } = message;

    if (!chatId || !content) {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
      return;
    }

    if (!ws.chats) {
      ws.chats = {};
    }

    if (!ws.chats[chatId]) {
      ws.chats[chatId] = [];
    }

    if (!ws.chat) {
      const { chat } = await startChat();
      ws.chat = chat;
    }

    const timestamp = new Date().toISOString();

    ws.chats[chatId].push({ sender: ws.user.id, content, timestamp });

    const messageData = {
      chat_id: chatId,
      user_id: ws.user.id,
      sender: 'USER',
      content: content,
    };
    await messages.create(messageData);

    const modelResponse = await sendPrompt({ chat: ws.chat, prompt: content });

    ws.chats[chatId].push({
      sender: 'MODEL',
      content: modelResponse,
      timestamp,
    });
    ws.send(
      JSON.stringify({
        chatId,
        sender: 'MODEL',
        content: modelResponse,
        timestamp,
      }),
    );

    const messageDataModel = {
      chat_id: chatId,
      user_id: ws.user.id,
      sender: 'MODEL',
      content: modelResponse,
    };
    await messages.create(messageDataModel);
  } catch (error) {
    ws.send(JSON.stringify({ message: 'Failed to process message', error }));
  }
};

module.exports = { wss };

JSON.stringify({
  type: 'auth',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI4OWM5Y2E1LWNmZjgtNGZkOC05MTk4LWU1MDBkOTBmNzQ1YyIsImlzUHJlbWl1bSI6dHJ1ZSwiaWF0IjoxNzE2ODQyNDgzLCJleHAiOjE3MTY4NDYwODN9.588TNY6oaqJvx-w4cK8syZ-C4tKaVjRdNk8lNKLNZMs',
});
JSON.stringify({
  chatId: '494cd487-af18-499a-bd49-fce4e801a53b',
  content: 'testing ws',
});
