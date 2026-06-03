# WebSocket Chat Application

## Overview

This version of the chat application uses **native WebSockets (websocket npm package)** to enable real-time communication between clients and the server.

Unlike HTTP polling, WebSockets keep a **persistent open connection**, allowing instant bidirectional messaging.

---

## Technology Used

- Node.js
- Express
- websocket (npm package)
- HTML / CSS / Vanilla JavaScript

---

## How It Works

1. Client connects to the WebSocket server
2. Server immediately sends chat history
3. Client can:
   - Send messages
   - Like messages
   - Dislike messages
4. Server broadcasts updates to all connected clients

---

## Message Flow

Client ⇄ WebSocket Server ⇄ All Connected Clients

---

## Server Responsibilities

- Stores all messages in memory
- Sends full chat history on new connection
- Handles incoming events:
  - `send-message`
  - `like-message`
  - `dislike-message`
- Broadcasts updates to all clients
- Ensures all clients stay in sync

---

## Client Responsibilities

- Establish WebSocket connection
- Render chat history on load
- Send message events to server
- Update UI when receiving:
  - New messages
  - Updated likes/dislikes

---

## Message Protocol

All communication uses JSON messages with a `command` field.

### Send Message

```json
{
  "command": "send-message",
  "message": {
    "username": "John",
    "text": "Hello!",
    "senderId": "client"
  }
}
```

---

### Like Message

```json
{
  "command": "like-message",
  "messageId": 123456789
}
```

---

### Dislike Message

```json
{
  "command": "dislike-message",
  "messageId": 123456789
}
```

---

## Server → Client Messages

### Chat History

```json
{
  "command": "chat-history",
  "messages": []
}
```

### New Message

```json
{
  "command": "new-message",
  "message": {}
}
```

### Updated Message (likes/dislikes)

```json
{
  "command": "message-updated",
  "message": {}
}
```

---

## Features

- Real-time messaging
- Persistent connection
- Like / Dislike system
- Live UI updates across all users
- Message history sync on join

---

## Advantages

- Instant communication (no polling delay)
- Efficient (single open connection)
- Scales better for real-time apps
- Supports bidirectional communication

---

## Disadvantages

- More complex than HTTP polling
- Requires connection lifecycle handling
- Needs reconnection handling (not implemented yet)

---

## Key Design Choice

Each message includes a **unique `id`** so that:

- Clients can identify which message to update
- Server can update likes/dislikes correctly
- UI stays consistent across all users