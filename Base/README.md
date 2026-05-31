# Base Chat Application (Socket.IO Version)

## Overview

This folder contains the original version of the real-time chat application built using **Socket.IO**.

It serves as the baseline implementation before refactoring the project into:
- Polling (HTTP-based communication)
- WebSocket (native websocket implementation)

---

## Technology Used

- Node.js
- Express
- Socket.IO
- HTML/CSS/JavaScript

---

## How It Works

The Socket.IO server enables real-time bidirectional communication between the client and server.

### Key features:
- Persistent connection between client and server
- Instant message broadcasting
- In-memory message storage
- Automatic updates across all connected clients

---

## Message Flow

Client → Socket.IO Server → All Connected Clients

---

## Purpose of This Version

This version was used as a starting point to understand real-time communication before implementing:
- Polling-based communication
- Raw WebSocket implementation