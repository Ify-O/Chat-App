require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3002;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5500";


app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

app.use(express.json());


app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.url}`,
  );

  next();
});



let messages = [];



function findMessage(id) {
  return messages.find(
    (message) => String(message.id) === String(id),
  );
}

function validateMessage(text) {
  if (typeof text !== "string") {
    return "Message must be a string.";
  }

  if (!text.trim()) {
    return "Message cannot be empty.";
  }

  if (text.trim().length > 250) {
    return "Message cannot exceed 250 characters.";
  }

  return null;
}

function validateUsername(username) {
  if (username === undefined) {
    return null;
  }

  if (typeof username !== "string") {
    return "Username must be a string.";
  }

  if (!username.trim()) {
    return "Username cannot be empty.";
  }

  if (username.trim().length > 20) {
    return "Username cannot exceed 20 characters.";
  }

  return null;
}


app.get("/", (req, res) => {
  res.status(200).json({
    status: "Polling Chat API is running 🚀",
  });
});



app.get("/api", (req, res) => {
  res.status(200).json({
    name: "Polling Chat API",
    version: "1.0.0",

    description:
      "A REST API powering a polling-based chat application.",

    endpoints: {
      "GET /messages": "Get all messages",
      "GET /messages/:id": "Get one message",
      "POST /messages": "Create a new message",
      "PATCH /messages/:id": "Edit a message",
      "DELETE /messages/:id": "Delete a message",
      "POST /messages/:id/like": "Like a message",
      "POST /messages/:id/dislike": "Dislike a message",
    },
  });
});



app.get("/messages", (req, res) => {
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  res.status(200).json(sortedMessages);
});



app.get("/messages/:id", (req, res) => {
  const message = findMessage(req.params.id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found.",
    });
  }

  res.status(200).json(message);
});



app.post("/messages", (req, res) => {
  const { username, text, senderId } = req.body;

  const textError = validateMessage(text);

  if (textError) {
    return res.status(400).json({
      error: textError,
    });
  }

  const usernameError = validateUsername(username);

  if (usernameError) {
    return res.status(400).json({
      error: usernameError,
    });
  }

  const now = Date.now();

  const message = {
    id: now,

    username:
      typeof username === "string" && username.trim()
        ? username.trim()
        : "Anonymous",

    text: text.trim(),

    senderId:
      typeof senderId === "string" && senderId.trim()
        ? senderId.trim()
        : "client",

    likes: 0,

    dislikes: 0,

    timestamp: now,

    updatedAt: null,
  };

  messages.push(message);

  res.status(201).json(message);
});



app.patch("/messages/:id", (req, res) => {
  const message = findMessage(req.params.id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found.",
    });
  }

  const { text } = req.body;

  const textError = validateMessage(text);

  if (textError) {
    return res.status(400).json({
      error: textError,
    });
  }

  message.text = text.trim();
  message.updatedAt = Date.now();

  res.status(200).json(message);
});



app.delete("/messages/:id", (req, res) => {
  const messageIndex = messages.findIndex(
    (message) =>
      String(message.id) === String(req.params.id),
  );

  if (messageIndex === -1) {
    return res.status(404).json({
      error: "Message not found.",
    });
  }

  const deletedMessage = messages.splice(
    messageIndex,
    1,
  )[0];

  res.status(200).json({
    message: "Message deleted successfully.",
    deletedMessage,
  });
});




app.post("/messages/:id/like", (req, res) => {
  const message = findMessage(req.params.id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found.",
    });
  }

  message.likes += 1;

  res.status(200).json(message);
});




app.post("/messages/:id/dislike", (req, res) => {
  const message = findMessage(req.params.id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found.",
    });
  }

  message.dislikes += 1;

  res.status(200).json(message);
});




app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});




app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    error: "Internal server error.",
  });
});




app.listen(PORT, () => {
  console.log(
    `Polling Chat API running on port ${PORT}`,
  );

  console.log(
    `Client allowed by CORS: ${CLIENT_URL}`,
  );
});