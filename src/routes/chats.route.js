const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/chats.controller');

router.post('/chats', messagesController.handleChatsCreation);

router.get('/chats', messagesController.handleGetAllChatsByUser);

module.exports = router;
