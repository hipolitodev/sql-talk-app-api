const streamResponse = async (content, websocketData) => {
    websocketData?.ws?.send(JSON.stringify({
        sender: 'MODEL_LOGS',
        content,
    }));
}

module.exports = streamResponse
