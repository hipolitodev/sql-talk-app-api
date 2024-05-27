const chats = require('../services/chats.service');
const logger = require('../utils/logger.util');

const handleChatsCreation = async (req, res) => {
  const { userId } = req.user;

  try {
    const chatCreated = await chats.create({ user_id: userId });
    res.status(201).json({
      status: 201,
      data: chatCreated,
      message: 'Chat created successfully.',
    });
  } catch (error) {
    const code = 'CHAT_CREATION_ERROR';
    const message = 'An error occurred while creating the Chat.';

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

const handleGetAllChatsByUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const chatsByUser = await chats.getAllByUser({ user_id: userId });
    res.status(200).json({
      status: 200,
      data: chatsByUser,
      message: 'Chats retrieved successfully.',
    });
  } catch (error) {
    const code = 'CHATS_RETRIEVAL_ERROR';
    const message = 'An error occurred while retrieving the Chats.';

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

module.exports = { handleChatsCreation, handleGetAllChatsByUser };
