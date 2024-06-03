# websocket.service.js

This module provides a function for creating a WebSocket server and handling client connections and messages.

## Usage

The WebSocket server created by this module is used to handle real-time communication between the server and the clients. Clients can send prompts to the server, which are then processed and responded to in real-time.

If a chatId is provided the messages will be saved on the chat.

Clients should send messages to the `/api/chats` endpoint of the WebSocket server in the following format:

```json
{
  "token": "your_jwt_token",
  "chatId": "optional_chat_id",
  "content": "your_message_content",
  "useChat": "yes_or_no"
}
```

Where:

- token: The JWT token for the client. This is required for authentication.
- chatId: The ID of the chat. This is optional and only needed if the message is part of a chat. If provided, the messages will be saved on the chat.
- content: The content of the message. This is what will be processed by the server.
- useChat: A flag indicating whether to use the chat or not. If 'yes', the model will use the chat option. If 'no', the model will use generate content. The default value is 'no'.

## Prompts examples

- What kind of information is in this database?
- What percentage of orders are returned?
- How is inventory distributed across our regional distribution centers?
- Do customers typically place more than one order?
- Which product categories have the highest profit margin?
