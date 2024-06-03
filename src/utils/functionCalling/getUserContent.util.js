const getEnhancedPrompt = require('./getEnhancedPrompt.util');

const getUserContent = (prompt) => {
  const enhancedPrompt = getEnhancedPrompt(prompt);

  return {
    role: 'user',
    parts: [{ text: enhancedPrompt }],
  };
};

module.exports = getUserContent;
