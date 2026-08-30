const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;



app.use(cors());
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


app.get("/", (req, res) => {
  res.status(200).json({
    status: "Polling Chat API is running 🚀",
  });
});



app.get("/messages", (req, res) => {
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  res.status(200).json(sortedMessages);
});



app.post("/messages", (req, res) => {
  const { username, text, senderId } = req.body;

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      error: "Message cannot be empty.",
    });
  }

  if (
    username !== undefined &&
    typeof username !== "string"
  ) {
    return res.status(400).json({
      error: "Username must be a string.",
    });
  }

  const message = {
    id: Date.now(),

    username:
      typeof username === "string" && username.trim()
        ? username.trim()
        : "Anonymous",

    text: text.trim(),

    senderId:
      typeof senderId === "string" && senderId.trim()
        ? senderId
        : "client",

    likes: 0,

    dislikes: 0,

    timestamp: Date.now(),
  };

  messages.push(message);

  res.status(201).json(message);
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
    error: "Route not found.",
  });
});



app.listen(PORT, () => {
  console.log(
    `Polling server running on port ${PORT}`,
  );
});