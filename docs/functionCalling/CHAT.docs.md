# chat.js

This module provides functions for starting a chat, processing a prompt, and sending a prompt.

## Functions

### `startChat()`

This asynchronous function starts a chat. It generates a model using the `generateModel` function from the `vertexAI` configuration and starts a chat using this model.

**Returns:** An object containing the `chat` object.

### `processPrompt({ prompt, chat, websocketData })`

This asynchronous function processes a given prompt. It sends a message to the chat, handles the response, and repeats this process until there are no more function calls to handle.

**Parameters:**

- `prompt`: The prompt to process.
- `chat`: The chat object.
- `websocketData`: The WebSocket data.

**Returns:** An object containing:

- `tokenCount`: An integer representing the total number of tokens used in the conversation.
- `contents`: An array of objects, where each object represents a part of the conversation. Each object has a `role` property that can be either `"user"`, `"model"` or `"function"`, and a `parts` array that contains the details of the conversation part. For example:

```json
    [
        {
            "role": "user",
            "parts": [
                {
                    "text": "\nYou are a data engineer at a large e-commerce company and your job is to analyze the PostgreSQL database.\nWhen asked a question, don't make assumptions about the data, only use the information you learn from the database.\nYou can ask questions about the database structure, list all the tables, list all columns in the database, list relationships between tables and make SQL queries.\n\nBefore crafting your own query make sure all the fields that you are using exist, do not guess o make assumptions about them.\nIn case of error try again. If you need additional information, ask for it.\n\nWhat percentage of orders are returned?\n"
                }
            ]
        },
        /* ... */
        {
            "role": "model",
            "parts": [
                {
                    "functionCall": {
                        "name": "sql_query",
                        "args": {
                            "query": "SELECT COUNT(*) FROM orders;"
                        }
                    }
                }
            ]
        },
        {
            "role": "function",
            "parts": [
                {
                    "functionResponse": {
                        "name": "sql_query",
                        "response": {
                            "content": [
                                {
                                    "count": "125074"
                                }
                            ]
                        }
                    }
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "0% of orders were returned."
                }
            ]
        }
    ]
```

### `sendPrompt({ chat, prompt, websocketData }, saveResponse = true)`

This asynchronous function sends a prompt. It processes the prompt using the `processPrompt` function and optionally saves the response.

**Parameters:**

- `chat`: The chat object.
- `prompt`: The prompt to send.
- `websocketData`: The WebSocket data.
- `saveResponse` (optional): A boolean indicating whether to save the response. Defaults to `true`.

**Returns:** The response from the `processPrompt` function.

## Exports

This module exports the `startChat` and `sendPrompt` functions.
