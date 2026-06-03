const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let messages = [];


app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const data = req.body;

  const message = {
    id: Date.now(),
    username: data.username || "Anonymous",
    text: data.text || "",
    senderId: data.senderId || "client",
    likes: 0,
    dislikes: 0,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.push(message);

  res.status(201).json(message);
});


app.post("/messages/:id/like", (req, res) => {
  const message = messages.find((m) => String(m.id) === String(req.params.id));

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.likes += 1;

  res.json(message);
});


app.post("/messages/:id/dislike", (req, res) => {
  const message = messages.find((m) => String(m.id) === String(req.params.id));

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.dislikes += 1;

  res.json(message);
});


const server = app.listen(3002, () => {
  console.log("Polling server running on http://localhost:3002");
});
