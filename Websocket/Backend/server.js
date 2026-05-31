const express = require("express");
const http = require("http");
const cors = require("cors");
const { server: WebSocketServer } = require("websocket");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const wsServer = new WebSocketServer({
  httpServer: server,
});

let messages = [];

function send(connection, data) {
  connection.sendUTF(JSON.stringify(data));
}

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  console.log("User connected");

  send(connection, {
    command: "chat-history",
    messages,
  });

  connection.on("message", (msg) => {
    if (msg.type !== "utf8") return;

    const data = JSON.parse(msg.utf8Data);

    if (data.command === "send-message") {
      const message = {
        id: Date.now(),
        username: data.message.username || "Anonymous",
        text: data.message.text || "",
        senderId: data.message.senderId,
        likes: 0,
        dislikes: 0,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      messages.push(message);

      wsServer.connections.forEach((client) => {
        send(client, {
          command: "new-message",
          message,
        });
      });
    }

    if (data.command === "like-message") {
      const message = messages.find(
        (msg) => String(msg.id) === String(data.messageId),
      );

      if (message) {
        message.likes++;

        wsServer.connections.forEach((client) => {
          send(client, {
            command: "message-updated",
            message,
          });
        });
      }
    }

    if (data.command === "dislike-message") {
      const message = messages.find(
        (msg) => String(msg.id) === String(data.messageId),
      );

      if (message) {
        message.dislikes++;

        wsServer.connections.forEach((client) => {
          send(client, {
            command: "message-updated",
            message,
          });
        });
      }
    }
  });

  connection.on("close", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("WebSocket server running on http://localhost:3000");
});
