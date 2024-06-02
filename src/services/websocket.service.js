const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messages = require('../services/messages.service');
const functionCallingChat = require('../services/functionCalling/index');
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
        ws.send(JSON.stringify({ error: UnableToReadMessage }));
        return;
      }

      if (!data.content) {
        ws.send(JSON.stringify({ error: UnableToReadMessage }));
        return;
      }

      // await validateToken(data);

      return data;
    }

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
        return;
      }

      try {
        const user = await verifyToken(token);
        ws.user = user;
        logger.info(`User ${user.id} authenticated successfully`);
      } catch (err) {
        ws.send(
          JSON.stringify({
            type: 'auth',
            success: false,
            message: 'Invalid token',
          }),
        );
      }
    }

    const handleIncomingMessage = async (ws, { chatId, content, useChat = false }) => {
      try {
        if (!!chatId) {
          await messages.create({
            chat_id: chatId,
            user_id: ws.user.id,
            sender: 'USER',
            content: content,
          });
        }

        const websocketData = {
          ws,
          chatData: {
            chat_id: chatId,
            user_id: ws?.user?.id,
          },
        };

        let modelResponse;
        try {
          if (useChat) {
            if (!ws.chat) {
              const { chat } = await functionCallingChat.startChat();
              ws.chat = chat;
            }

            modelResponse = await functionCallingChat.sendPrompt({
              chat: ws.chat,
              prompt: content,
              websocketData
            }, !!chatId);
          } else {
            modelResponse = await functionCallingGC.generateContent({
              prompt: content,
              websocketData,
            }, !!chatId);
          }

          ws.send(
            JSON.stringify({
              sender: 'MODEL',
              content: modelResponse,
            }),
          );
        } catch (error) {
          if (error.message === 'WebSocket is not open: readyState 3 (CLOSED)') {
            logger.info('WebSocket connection closed, but sendPrompt will continue running.');
          } else {
            throw error;
          }
        }
      } catch (error) {
        logger.info(error);
        ws.send(JSON.stringify({ message: 'Failed to process message', error }));
      }
    };

    ws.on('message', async (message) => {
      const validatedMessage = await validateMessage(message);
      handleIncomingMessage(ws, validatedMessage);
    });

    ws.on('close', () => {
      logger.info('Client disconnected');
    });
  });

  return wss
}

module.exports = { createSocketServer };
