const messages = require('../services/messages.service');
const logger = require('../utils/logger.util');

const handleMessagesCreation = async (req, res) => {
  const messageData = {
    chat_id: req.params.chatID,
    user_id: req.user.userId,
    sender: req.user.userId ? 'USER' : 'MODEL',
    content: req.body.content,
  };

  try {
    const messageCreated = await messages.create(messageData);
    res.status(201).json({
      status: 201,
      data: messageCreated,
      message: 'Message created successfully.',
    });
  } catch (error) {
    const code = 'MESSAGE_CREATION_ERROR';
    const message = 'An error occurred while creating the Message.';

    logger.error({
      code,
      message: error.message || error || message,
    });
    res.status(500).json({
      status: 500,
      error: {
        code,
        message,
      },
    });
  }
};

const handleMessagesList = async (req, res) => {
  const chatID = req.params.chatID;

  try {
    const messagesList = await messages.getAllChatMessages({ chat_id: chatID });
    res.status(200).json({
      status: 200,
      data: messagesList,
      message: 'Messages retrieved successfully.',
    });
  } catch (error) {
    const code = 'MESSAGES_RETRIEVAL_ERROR';
    const message = 'An error occurred while retrieving the Messages.';

    logger.error({
      code,
      message: error.message || error || message,
    });
    res.status(500).json({
      status: 500,
      error: {
        code,
        message,
      },
    });
  }
};

module.exports = {
  handleMessagesCreation,
  handleMessagesList,
};
