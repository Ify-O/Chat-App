# Polling Chat Application

## Overview

This version of the chat application uses **HTTP Polling** to simulate real-time communication.

Instead of maintaining a persistent connection, the client repeatedly requests updates from the server.

---

## Technology Used

- Node.js
- Express
- HTML/CSS/JavaScript
- Fetch API
- setInterval (for polling)

---

## How It Works

The client sends requests to the server at regular intervals to fetch new messages.

### Key endpoints:
- `GET /messages` → retrieves all messages
- `POST /messages` → sends a new message

---

## Message Flow

Client → HTTP Request → Server → Response  
(Client repeats this every few seconds)

---

## Key Feature

Polling is simulated using:

```js id="pollcode1"
setInterval(() => {
  fetch("/messages")
}, 1000);