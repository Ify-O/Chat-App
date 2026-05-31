# WEBSOCKET README

````md id="ws1"
# WebSocket Chat Application

## Overview

This version uses **native WebSockets (websocket npm package)** to implement real-time communication.

It replaces HTTP polling with a persistent connection between client and server.

---

## Technology Used

- Node.js
- Express
- websocket npm package
- HTML/CSS/JavaScript

---

## How It Works

A persistent connection is established between client and server.

Both sides can send messages at any time.

---

## Message Flow

Client ⇄ WebSocket Server ⇄ All Clients

---

## Server Features

- Stores messages in memory
- Sends chat history on connection
- Broadcasts new messages instantly
- Handles disconnections

---

## Advantages

- Real-time communication
- Low latency
- Efficient (no repeated HTTP requests)

---

## Disadvantages

- More complex setup
- Requires connection management

---

## Message Protocol

All messages use a structured format:

```json id="wsmsg1"
{
  "command": "send-message",
  "message": {
    "username": "John",
    "text": "Hello"
  }
}
```
````
