const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');
const { startChat, sendPrompt } = require('../services/functionCalling/index');

const wss = new WebSocket.Server({ port: 8080, path: '/api/chats' });
console.log('Starting WebSocket server');

wss.on('connection', (ws) => {
  console.log('A new client connected');

  ws.isAuthenticated = false;

  ws.on('message', async (message) => {
    if (!message) {
      console.log('Received undefined message');
      return;
    }

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.log('Failed to parse message:', err);
      return;
    }

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
    const { chatId, content, dontSave } = message;

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

    if (!dontSave) {
      const messageData = {
        chat_id: chatId,
        user_id: ws.user.id,
        sender: 'USER',
        content: content,
      };
      await messages.create(messageData);
    }

    const modelResponse = await sendPrompt({
      chat: ws.chat,
      prompt: content,
      ws,
      modelMessageData: {
        chat_id: chatId,
        user_id: ws.user.id,
        sender: 'MODEL',
      },
    });

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
    console.log(error);
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
  chatId: '84b01b38-f485-4c56-a2e5-7a655586092d',
  content: 'testing ws',
});
