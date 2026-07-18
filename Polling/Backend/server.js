const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// In-memory message storage
let messages = [];

/**
 * Find a message by ID
 */
function findMessage(id) {
  return messages.find((message) => String(message.id) === String(id));
}

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    status: "Polling Chat API is running 🚀",
  });
});

/**
 * Get all messages
 */
app.get("/messages", (req, res) => {
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  res.status(200).json(sortedMessages);
});

/**
 * Create a new message
 */
app.post("/messages", (req, res) => {
  const { username, text, senderId } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Message cannot be empty.",
    });
  }

  const message = {
    id: Date.now(),
    username: username?.trim() || "Anonymous",
    text: text.trim(),
    senderId: senderId || "client",
    likes: 0,
    dislikes: 0,
    timestamp: Date.now(),
  };

  messages.push(message);

  res.status(201).json(message);
});

/**
 * Like a message
 */
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

/**
 * Dislike a message
 */
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

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Polling server running on port ${PORT}`);
});
