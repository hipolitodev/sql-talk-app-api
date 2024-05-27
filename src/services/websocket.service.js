const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');

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

    const timestamp = new Date().toISOString();

    ws.chats[chatId].push({ sender: ws.user.id, content, timestamp });

    const messageData = {
      chat_id: chatId,
      user_id: ws.user.id,
      sender: 'USER',
      content: content,
    };
    await messages.create(messageData);

    const modelResponse = aiRespond(content);

    ws.chats[chatId].push({ sender: 'AI', content: modelResponse, timestamp });
    ws.send(
      JSON.stringify({
        chatId,
        sender: 'AI',
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

const aiRespond = (message) => {
  return `AI response to "${message}"`;
};

module.exports = { wss };

JSON.stringify({
  type: 'auth',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI4MTRlOTZhLWRjMjItNGQ4Ni1iOWM0LWNjYTZiNGI2MDhiYyIsImlzUHJlbWl1bSI6dHJ1ZSwiaWF0IjoxNzE2Nzk3MjQ0LCJleHAiOjE3MTY4MDA4NDR9.nt1Xb63JKMB8UJDSRt2Tz-yRofZjRcUc6NLNU_uzvL8',
});
JSON.stringify({
  chatId: '8cad6960-1360-4150-96df-79987d458ebb',
  content: 'testing ws',
});
