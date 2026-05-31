
---

# 📄 4. ROOT README (MOST IMPORTANT)

```md id="root1"
# Chat Application — Polling vs WebSockets vs Socket.IO

## Overview

This project demonstrates three different implementations of a real-time chat application:

1. Base version using Socket.IO
2. Polling-based version using HTTP
3. WebSocket-based version using native WebSockets

The goal is to understand and compare different real-time communication strategies.

---

## Project Structure

chat-app/
│
├── base/ (Socket.IO version)
├── polling/ (HTTP polling version)
├── websocket/ (Native WebSocket version)


---

## Technologies Used

- Node.js
- Express
- Socket.IO (base version only)
- HTTP + Fetch API (polling)
- websocket npm package (WebSocket version)
- HTML/CSS/JavaScript

---

## Architecture Comparison

### Polling
Client → HTTP GET/POST → Server

### WebSocket
Client ⇄ Persistent Connection ⇄ Server

### Socket.IO (Base)
Client ⇄ Socket.IO abstraction ⇄ Server

---

## Comparison Table

| Feature        | Polling | WebSocket | Socket.IO |
|----------------|--------|------------|------------|
| Real-time      | ❌     | ✅         | ✅         |
| Efficiency     | ❌     | ✅         | ✅         |
| Complexity     | Low    | Medium     | Medium     |
| Performance    | Low    | High       | High       |

---

## Key Learning Outcomes

- Understanding HTTP-based communication (polling)
- Understanding persistent WebSocket connections
- Comparing real-time communication techniques
- Structuring scalable messaging systems
- Using event-based architecture for chat apps

---

## How to Run

Each folder contains its own backend and frontend.

### Example:

#### Polling
```bash id="run1"
cd polling/backend
node server.js