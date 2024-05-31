const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');
const { startChat, sendPrompt } = require('../services/functionCalling/index');
const logger = require('../utils/logger.util');

const createSocketServer = (server) => {
  const wss = new WebSocket.Server({ server, path: '/api/chats' });
  logger.info('Starting WebSocket server...');

  wss.on('connection', (ws) => {
    logger.info('A new client connected');

    ws.on('message', async (message) => {
      if (!message) {
        logger.info('Received undefined message');
        return;
      }

      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        logger.info('Failed to parse message:', err);
        return;
      }

      if (!!data.token) {
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
          handleIncomingMessage(ws, data);
          logger.info(`User ${user.id} authenticated successfully`);
        });
      } else {
        ws.send(JSON.stringify({ error: 'Authentication required' }));
      }
    });

    ws.on('close', () => {
      logger.info('Client disconnected');
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
      logger.info(error);
      ws.send(JSON.stringify({ message: 'Failed to process message', error }));
    }
  };

  return wss
}

module.exports = { createSocketServer };

