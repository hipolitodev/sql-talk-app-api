const getEnhancedPrompt = require('./getEnhancedPrompt.util');

const getUserContent = (prompt) => {
    const enhancedPrompt = getEnhancedPrompt(prompt);

    return {
        parts: [
            { text: enhancedPrompt }
        ],
        role: 'user'
    }
}

module.exports = getUserContent;
