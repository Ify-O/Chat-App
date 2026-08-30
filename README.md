# Polling Chat Application

A full-stack chat application built to explore **client-server communication, HTTP polling, RESTful API design, and real-time communication with WebSockets and Socket.IO**.

The project started as a simple polling-based chat application and was progressively improved by introducing RESTful API operations, request validation, error handling, environment variables, CORS configuration, message editing and deletion, and improved reaction handling.

The project also forms part of a broader exploration of different approaches to real-time communication, including **HTTP polling, native WebSockets, and Socket.IO**.

---

## Live Demo

* **Frontend:** https://mc-chatapp.netlify.app/
* **Backend API:** https://chat-app-backend-gr6s.onrender.com/

> **Note:** The backend is hosted on Render's free tier. After a period of inactivity, the first request may take approximately 30–60 seconds while the service starts.

---

## Screenshots

### Join Screen

![Join Screen](./Screenshots/join-screen.png)

### Chat Interface

![Polling Chat Application](./Screenshots/polling-chat.png)

---

## Overview

This project is a full-stack chat application designed to explore how different technologies can be used to enable communication between clients and a server.

The primary implementation uses **HTTP polling**. The frontend periodically sends requests to the Express backend to check for updated messages.

The backend exposes a RESTful API that allows clients to create, retrieve, update, delete, and react to messages.

Users can:

* Join the chat with a username
* Send messages
* View messages from other users
* Edit messages
* Delete messages
* Like and dislike messages
* Receive updated messages through HTTP polling

The frontend communicates with the backend using the JavaScript **Fetch API**.

---

# Communication Approaches Explored

One of the main learning goals of this project was understanding different approaches to client-server communication.

### 1. HTTP Polling

The main application uses HTTP polling.

The client periodically requests the latest messages from the server:

```text
Client
   │
   │ GET /messages
   ▼
Server
   │
   │ Return messages
   ▼
Client
   │
   │ Wait
   ▼
GET /messages
   │
   ▼
Repeat
```

This approach is simple and works with standard HTTP requests, but it can generate unnecessary requests when there are no new messages.

---

### 2. Native WebSockets

I also explored **native WebSockets** to understand how persistent, two-way communication works between a client and server.

Unlike polling, WebSockets allow the server to send information to connected clients without the client having to repeatedly request updates.

**WebSocket implementation:**
*https://github.com/Ify-O/Chat-App-WebSocket*

---

### 3. Socket.IO

I also explored **Socket.IO** as another approach to real-time communication.

Socket.IO provides an abstraction around real-time connections and includes additional features that can simplify communication between clients and servers.

**Socket.IO implementation:**
*Add your Socket.IO file/repository link here.*

---

### Comparing the Approaches

| Approach     | Communication          | Server Push | Main Learning                        |
| ------------ | ---------------------- | ----------- | ------------------------------------ |
| HTTP Polling | Repeated HTTP requests | No          | REST APIs and polling                |
| WebSockets   | Persistent connection  | Yes         | Native real-time communication       |
| Socket.IO    | Persistent connection  | Yes         | Higher-level real-time communication |

Exploring all three approaches helped me understand why WebSockets are generally more suitable for applications that require frequent real-time updates, while polling can be useful for simpler applications and learning how HTTP-based communication works.

---

# Features

## Chat

* Join the chat using a username
* Send messages
* View messages from multiple users
* Automatic message updates using HTTP polling
* Display message timestamps

## Message Management

* Retrieve all messages
* Retrieve an individual message
* Create messages
* Edit existing messages
* Delete messages
* Validate message input before processing requests

## Reactions

* Like messages
* Dislike messages
* Update reaction counts through API requests
* Handle invalid message IDs

## Backend & API

* RESTful API architecture
* Appropriate HTTP methods
* HTTP status codes
* JSON request and response handling
* API error handling
* Request validation
* CORS configuration
* Environment variable configuration
* Custom request logging middleware

---

# Technologies Used

## Backend

* Node.js
* Express.js
* CORS
* REST API
* dotenv
* JavaScript

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Fetch API

## Real-Time Communication

* HTTP Polling
* Native WebSockets
* Socket.IO

## Development & Deployment

* Git
* GitHub
* Netlify
* Render

---

# RESTful API

The backend follows REST principles by using HTTP methods according to the operation being performed.

## API Endpoints

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/`                     | API health check      |
| GET    | `/messages`             | Retrieve all messages |
| GET    | `/messages/:id`         | Retrieve one message  |
| POST   | `/messages`             | Create a new message  |
| PATCH  | `/messages/:id`         | Edit a message        |
| DELETE | `/messages/:id`         | Delete a message      |
| POST   | `/messages/:id/like`    | Like a message        |
| POST   | `/messages/:id/dislike` | Dislike a message     |

---

# API Reference

## `GET /`

Returns the current status of the API.

### Example Response

```json
{
  "status": "Polling Chat API is running"
}
```

**Status:** `200 OK`

---

## `GET /messages`

Retrieves all messages.

### Example Response

```json
[
  {
    "id": 123456789,
    "username": "Ifeoma",
    "text": "Hello!",
    "senderId": "abc123",
    "likes": 2,
    "dislikes": 0,
    "timestamp": 123456789
  }
]
```

**Status:** `200 OK`

---

## `GET /messages/:id`

Retrieves a single message using its ID.

### Example

```text
GET /messages/123456789
```

If the message exists, the API returns the message object.

If the message does not exist:

```json
{
  "error": "Message not found."
}
```

**Status:** `404 Not Found`

---

## `POST /messages`

Creates a new message.

### Request Body

```json
{
  "username": "Ifeoma",
  "text": "Hello everyone!",
  "senderId": "abc123"
}
```

### Response

The API returns the newly created message.

**Status:** `201 Created`

If the message is empty:

```json
{
  "error": "Message cannot be empty."
}
```

**Status:** `400 Bad Request`

---

## `PATCH /messages/:id`

Updates an existing message.

### Example

```text
PATCH /messages/123456789
```

### Request Body

```json
{
  "text": "Updated message"
}
```

The API validates the message ID and request body before updating the message.

**Successful status:** `200 OK`

If the message cannot be found:

**Status:** `404 Not Found`

---

## `DELETE /messages/:id`

Deletes an existing message.

### Example

```text
DELETE /messages/123456789
```

If the message exists, it is removed from the application's message store.

**Successful status:** `200 OK`

If the message cannot be found:

**Status:** `404 Not Found`

---

## `POST /messages/:id/like`

Adds a like to a message.

### Example

```text
POST /messages/123456789/like
```

**Successful status:** `200 OK`

If the message does not exist:

**Status:** `404 Not Found`

---

## `POST /messages/:id/dislike`

Adds a dislike to a message.

### Example

```text
POST /messages/123456789/dislike
```

**Successful status:** `200 OK`

If the message does not exist:

**Status:** `404 Not Found`

---

# HTTP Status Codes

The API uses HTTP status codes to communicate the result of requests.

| Status | Meaning               | Example                                             |
| ------ | --------------------- | --------------------------------------------------- |
| `200`  | OK                    | Successful retrieval, update, deletion, or reaction |
| `201`  | Created               | Message successfully created                        |
| `400`  | Bad Request           | Invalid or missing request data                     |
| `404`  | Not Found             | Requested message does not exist                    |
| `500`  | Internal Server Error | Unexpected server-side error                        |

---

# How HTTP Polling Works

HTTP is a request-response protocol. Unlike WebSockets, the server cannot automatically push new messages to the client.

The frontend therefore periodically requests the latest messages.

The application uses a recursive `setTimeout()` approach:

```javascript
async function startPolling() {
  await fetchMessages();

  setTimeout(() => {
    startPolling();
  }, 1000);
}
```

The client:

1. Sends `GET /messages`
2. Receives the current messages
3. Updates the interface when necessary
4. Waits approximately one second
5. Sends another request
6. Repeats the process

Using `setTimeout()` after the request completes also helps prevent multiple polling requests from running simultaneously if a request takes longer than expected.

---

# Middleware

The Express backend demonstrates several types of middleware.

## JSON Middleware

```javascript
app.use(express.json());
```

Parses JSON request bodies so the server can access data through:

```javascript
req.body
```

---

## CORS Middleware

CORS allows the frontend and backend to communicate when they are hosted on different origins.

The allowed frontend URL is configured through an environment variable.

```env
CLIENT_URL=https://mc-chatapp.netlify.app
```

---

## Request Logging Middleware

The application includes custom middleware for monitoring incoming requests.

```javascript
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.url}`
  );

  next();
});
```

This helps monitor API activity during development and debugging.

---

# Request Validation

The API validates incoming data before processing requests.

For example, messages cannot be empty.

```javascript
if (!text || !text.trim()) {
  return res.status(400).json({
    error: "Message cannot be empty."
  });
}
```

Validation helps prevent invalid data from entering the application.

---

# API Error Handling

The frontend checks API responses before processing them.

For example:

```javascript
if (!response.ok) {
  throw new Error("Unable to fetch messages.");
}
```

The backend also returns meaningful error responses when requests fail.

Example:

```json
{
  "error": "Message not found."
}
```

This allows the frontend to distinguish between successful and unsuccessful requests.

---

# Environment Variables

Environment variables are used to keep configuration separate from application code.

The backend uses a `.env` file for values such as:

```env
PORT=3002
CLIENT_URL=http://localhost:5500
```

The `.env` file is excluded from Git using `.gitignore`.

A `.env.example` file is included so that other developers know which environment variables are required without exposing the actual values.

Example:

```env
PORT=3002
CLIENT_URL=http://localhost:5500
```

> Never commit the actual `.env` file or sensitive credentials to GitHub.

---

# Project Structure

```text
Chat-App/
│
├── Polling/
│   │
│   ├── Backend/
│   │   ├── node_modules/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── server.js
│   │
│   └── Frontend/
│       ├── index.html
│       ├── script.js
│       ├── style.css
│       └── README.md
│
├── Screenshots/
│   ├── join-screen.png
│   └── polling-chat.png
│
└── README.md
```

> `node_modules` and `.env` should not be committed to GitHub. They are shown above only to illustrate the local project structure.

---

# Deployment

The project separates the frontend and backend.

### Frontend

The static frontend is deployed using **Netlify**.

### Backend

The Express REST API is deployed using **Render**.

```text
Browser
   │
   │ HTTPS requests
   ▼
Netlify
Frontend
   │
   │ REST API requests
   ▼
Render
Express Backend
   │
   ▼
In-memory message storage
```

This architecture demonstrates how a separately hosted frontend can communicate with a backend API.

---

# Advantages of HTTP Polling

* Simple to implement
* Uses standard HTTP requests
* Easy to understand and debug
* Works with standard browser APIs
* Does not require a persistent connection
* Useful for learning client-server communication and REST APIs

---

# Limitations of HTTP Polling

* It is not true real-time communication
* Requests are sent even when there are no new messages
* Frequent requests can increase network traffic
* It can increase server workload
* Updates can be delayed depending on the polling interval
* Less efficient than persistent connections for frequent real-time updates

---

# Current Data Storage

The application currently uses **in-memory storage** on the backend.

Messages are stored in a JavaScript array while the server is running.

This was intentionally used to keep the project focused on understanding:

* REST APIs
* HTTP methods
* Request/response cycles
* Polling
* CRUD operations

Because the data is stored in memory, messages are lost whenever the backend server restarts.

---

# Learning Outcomes

Building and progressively improving this project helped me understand:

* RESTful API design
* CRUD operations
* HTTP methods: `GET`, `POST`, `PATCH`, and `DELETE`
* HTTP status codes
* Request and response handling
* Express routing
* Express middleware
* CORS
* Request validation
* API error handling
* Environment variables
* Fetch API
* Client-server communication
* HTTP polling
* Native WebSockets
* Socket.IO
* The differences between polling and persistent connections
* Frontend and backend deployment

The project also helped me understand that different communication technologies solve different problems. Building the same type of application using multiple approaches provided practical experience beyond simply following a single implementation.

---

# Future Improvements

Potential future improvements include:

* Persistent message storage using a database
* User authentication and authorisation
* User-specific permissions for editing and deleting messages
* Improved reaction logic to prevent repeated reactions
* Typing indicators
* Read receipts
* Private conversations
* Pagination for large numbers of messages
* Automated API testing
* API documentation using OpenAPI/Swagger
* Improved frontend error messages
* Migration of the primary application from polling to WebSockets for true real-time communication

---

# Project Goals

This project is part of my continued development in **software development, backend APIs, cloud technologies, and real-time communication**.

The project began as an introduction to HTTP polling and gradually evolved into a broader exploration of backend development.

By implementing and comparing **HTTP polling, RESTful APIs, native WebSockets, and Socket.IO**, I was able to develop a stronger understanding of how frontend applications communicate with backend services and how different architectures affect real-time applications