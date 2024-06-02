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

        const validateMessage = (message) => {
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

            if (!message.chatId || !message.content) {
                ws.send(JSON.stringify({ error: UnableToReadMessage }));
                return;
            }

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

        const validateToken = async (data) => {
            const token = data.token;

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

        ws.on('message', async (message) => {
            const validatedMessage = validateMessage(message);
            await validateToken(validatedMessage);

            handleIncomingMessage(ws, validatedMessage);
        });

        ws.on('close', () => {
            logger.info('Client disconnected');
        });
    });

    const handleIncomingMessage = async (ws, message) => {
        try {
            const { chatId, content, dontSave } = message;

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

            let modelResponse;
            try {
                modelResponse = await sendPrompt({
                    chat: ws.chat,
                    prompt: content,
                    websocketData: {
                        ws,
                        chatData: {
                            chat_id: chatId,
                            user_id: ws.user.id,
                        },
                    },
                });
            } catch (error) {
                if (error.message === 'WebSocket is not open: readyState 3 (CLOSED)') {
                    logger.info('WebSocket connection closed, but sendPrompt will continue running.');
                } else {
                    throw error;
                }
            }

            ws.chats[chatId].push({
                sender: 'MODEL',
                content: modelResponse,
                timestamp,
            });
            ws.send(
                JSON.stringify({
                    sender: 'MODEL',
                    content: modelResponse,
                }),
            );
        } catch (error) {
            logger.info(error);
            ws.send(JSON.stringify({ message: 'Failed to process message', error }));
        }
    };

    return wss
}

module.exports = { createSocketServer };
