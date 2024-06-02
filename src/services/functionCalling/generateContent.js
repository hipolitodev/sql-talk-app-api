require('dotenv').config();

const vertexAI = require('../../configs/vertexAI');
const { functions, functionNames, functionDeclarations } = require('./functions');
const messages = require('../messages.service');
const delay = require('../../utils/functionCalling/delay.util');
const getEnhancedPrompt = require('../../utils/functionCalling/getEnhancedPrompt.util');

const getUserContent = (prompt) => {
    const enhancedPrompt = getEnhancedPrompt(prompt);

    return {
        parts: [
            { text: enhancedPrompt }
        ],
        role: 'user'
    }
}

const getModel = async () => {
    const tools = [{ functionDeclarations }];
    const model = await vertexAI.generateModel(tools, functionNames);

    return { model, tools };
};

const streamResponse = async (content, websocketData) => {
    websocketData?.ws?.send(JSON.stringify({
        sender: 'MODEL_LOGS',
        content,
    }));
}

const handleFunctionCall = async (call) => {
    const functionAction = functions.find((f) => f.declaration.name === call.name);
    if (!functionAction) return;

    const params = Object.assign({}, call.args);
    const content = await functionAction.action(params);

    return {
        role: 'function',
        parts: [
            {
                functionResponse: {
                    name: call.name,
                    response: {
                        content
                    }
                }
            }
        ],
    }
};

const processPrompt = async ({
    contents,
    model,
    tools,
    websocketData,
}) => {
    let call = null;

    let modelDelay = {
        startTime: Date.now(),
        callCount: 0,
        maxTime: 60000,
        maxCalls: 1,
    }

    do {
        const { response } = await model.generateContent({ contents, tools });
        const modelContent = response?.candidates?.[0]?.content;

        contents.push(modelContent);
        streamResponse(modelContent, websocketData);

        call = modelContent?.parts.find(part => Boolean(part.functionCall))?.functionCall;

        if (call) {
            const functionContent = await handleFunctionCall(call);
            contents.push(functionContent);
            streamResponse(functionContent, websocketData)
        }

        // NOTE: wait time caused by model limits on my account, disable if not needed
        modelDelay = await delay(modelDelay, () => streamResponse('Delaying for 60s...', websocketData))
    } while (call);

    return { contents };
};

const generateContent = async ({ prompt, websocketData }, saveResponse = true) => {
    const userContent = getUserContent(prompt);
    const contents = [userContent]

    const { model, tools } = await getModel();
    const response = processPrompt({
        contents,
        model,
        tools,
        websocketData,
    })

    if (saveResponse) {
        await messages.create({
            ...websocketData.chatData,
            sender: 'MODEL',
            content,
        });
    }

    return response;
};

module.exports = {
    generateContent,
};
