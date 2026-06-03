# Polling Chat Application

## Overview

This version of the chat application uses **HTTP Polling with a REST API** to simulate real-time messaging.

Instead of maintaining a persistent connection (like WebSockets), the client repeatedly requests updates from the server at fixed intervals.

This demonstrates how traditional web applications achieve near real-time behavior using HTTP.

---

## Technology Used

- Node.js
- Express
- REST API principles
- Middleware (Express)
- HTML / CSS / JavaScript
- Fetch API
- setInterval (polling mechanism)

---

## How It Works

The system is built around a REST API that manages chat messages as a resource.

The client:
- sends messages via HTTP POST
- fetches messages periodically via HTTP GET
- updates the UI based on server responses

---

## REST API Endpoints

### Get all messages
```
GET /messages
```

### Send a new message
```
POST /messages
```

### Like a message
```
POST /messages/:id/like
```

### Dislike a message
```
POST /messages/:id/dislike
```

---

## Message Flow

Client → HTTP Request → Express Server → Response → UI Update  
(repeated every second using polling)

---

## Middleware (IMPORTANT)

This project demonstrates Express middleware usage:

### 1. Built-in middleware
```js
app.use(express.json());
```
Parses incoming JSON request bodies.

---

### 2. CORS middleware
```js
app.use(cors());
```
Allows frontend and backend to communicate across different origins.

---

### 3. Custom logging middleware
```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

This logs every request and demonstrates how middleware works in a request lifecycle.

---

## Polling Mechanism

Polling is implemented using:

```js
setInterval(() => {
  fetch("/messages");
}, 1000);
```

This ensures the client updates the chat interface every second.

---

## Key Features

- RESTful API design
- Message creation and retrieval
- Like / Dislike functionality
- Middleware integration
- Simulated real-time updates via polling

---

## Advantages

- Simple architecture
- Easy to understand and implement
- Uses standard HTTP (no special protocols needed)
- Good introduction to REST APIs and client-server communication

---

## Disadvantages

- Not truly real-time
- Repeated network requests even when nothing changes
- Less efficient than WebSockets
- Higher server load under scale

---

## Key Learning Outcome

This implementation demonstrates:

- How REST APIs structure data around resources
- How middleware processes requests in Express
- How polling simulates real-time updates
- The limitations of HTTP-based real-time systems compared to WebSockets