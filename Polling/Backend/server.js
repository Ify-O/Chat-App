const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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
    senderId: data.senderId,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.push(message);

  res.status(201).json(message);
});


