const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');

router.post(
  '/chats/:chatID/messages',
  messagesController.handleMessagesCreation,
);

router.get('/chats/:chatID/messages', messagesController.handleMessagesList);

module.exports = router;
