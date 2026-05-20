const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  // send old messages
  socket.emit("chat-history", messages);

  socket.on("send-message", (data) => {
    const message = {
      id: Date.now(),
      text: data.text,
      senderId: data.senderId,
    };

    messages.push(message); // store in backend

    io.emit("receive-message", message); // broadcast
  });
});

socket.on("disconnect", () => {
  console.log("User disconnected:", socket.id);
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
