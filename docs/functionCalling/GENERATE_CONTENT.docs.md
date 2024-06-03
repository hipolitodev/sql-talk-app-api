# generateContent.js

This module provides a function for generating content based on a given prompt.

## Functions

### `getModel()`

This asynchronous function generates a model using the `generateModel` function from the `vertexAI` configuration.

**Returns:** An object containing the `model` and the `tools`.

### `processPrompt({ contents, model, tools, websocketData })`

This asynchronous function processes a given prompt. It generates content using the model, handles the response, and repeats this process until there are no more function calls to handle.

**Parameters:**

- `contents`: The contents to process.
- `model`: The model object.
- `tools`: The tools object.
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

### `generateContent({ prompt, websocketData }, saveResponse = true)`

This asynchronous function generates content for a given prompt. It gets the user content from the prompt, generates a model, processes the prompt, and optionally saves the response using the `messages` service.

**Parameters:**

- `prompt`: The prompt to generate content for.
- `websocketData`: The WebSocket data.
- `saveResponse` (optional): A boolean indicating whether to save the response. Defaults to `true`.

**Returns:** The response from the `processPrompt` function.

## Exports

This module exports the `generateContent` function.
