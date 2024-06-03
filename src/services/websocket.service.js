const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');
const functionCallingChat = require('../services/functionCalling/chat');
const functionCallingGC = require('../services/functionCalling/generateContent');
const logger = require('../utils/logger.util');

const createSocketServer = (server) => {
  const wss = new WebSocket.Server({ server, path: '/api/chats' });
  logger.info('Starting WebSocket server...');

  wss.on('connection', (ws) => {
    logger.info('A new client connected');

    const validateMessage = async (message) => {
      const UnableToReadMessage = 'Unable to read message';

      if (!message) {
        ws.send(JSON.stringify({ error: UnableToReadMessage }));
        return;
      }

      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        logger.error(err);
        ws.send(JSON.stringify({ error: UnableToReadMessage }));
        return;
      }

      if (!data.content) {
        ws.send(JSON.stringify({ error: UnableToReadMessage }));
        return;
      }

      const isValid = await validateToken(data);
      if (!isValid) {
        return;
      }

      return data;
    };

    const verifyToken = (token) => {
      const secret = process.env.JWT_SECRET;
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    };

    const validateToken = async ({ token }) => {
      if (!token) {
        ws.send(
          JSON.stringify({
            type: 'auth',
            success: false,
            message: 'Token is required',
          }),
        );
        return false;
      }

      try {
        const user = await verifyToken(token);
        ws.user = user;
        logger.info(`User ${user.id} authenticated successfully`);
        return true;
      } catch (err) {
        logger.error(err);
        ws.send(
          JSON.stringify({
            type: 'auth',
            success: false,
            message: 'Invalid token',
          }),
        );
        return false;
      }
    };

    const handleIncomingMessage = async (
      ws,
      { chatId, content, modelVersion = '1.5', useChatMethod = 'no' },
    ) => {
      try {
        if (chatId) {
          await messages.create({
            chat_id: chatId,
            user_id: ws.user.id,
            sender: 'USER',
            content,
          });
        }
      } catch (error) {
        logger.error(error);
        ws.send(
          JSON.stringify({ message: 'Failed to save incoming message', error }),
        );
      }

      try {
        let modelResponse;
        const prompt = content;
        const websocketData = {
          ws,
          chatData: {
            chat_id: chatId,
            user_id: ws?.user?.id,
          },
        };

        if (useChatMethod === 'yes') {
          if (!ws.chat) {
            const { chat } = await functionCallingChat.startChat(modelVersion);
            ws.chat = chat;
          }

          modelResponse = await functionCallingChat.sendPrompt(
            {
              chat: ws.chat,
              prompt,
              websocketData,
              modelVersion
            },
            !!chatId,
          );
        } else {
          modelResponse = await functionCallingGC.generateContent(
            {
              prompt,
              websocketData,
              modelVersion
            },
            !!chatId,
          );
        }

        ws.send(
          JSON.stringify({
            sender: 'MODEL',
            content: modelResponse,
          }),
        );
      } catch (error) {
        if (error.message === 'WebSocket is not open: readyState 3 (CLOSED)') {
          logger.info(
            'WebSocket connection closed, but sendPrompt will continue running.',
          );
        } else {
          ws.send(
            JSON.stringify({ message: 'Failed to process message', error }),
          );
        }
      }
    };

    ws.on('message', async (message) => {
      const validatedMessage = await validateMessage(message);

      if (!validatedMessage) {
        return;
      }

      handleIncomingMessage(ws, validatedMessage);
    });

    ws.on('close', () => {
      logger.info('Client disconnected');
    });
  });

  return wss;
};

module.exports = { createSocketServer };
