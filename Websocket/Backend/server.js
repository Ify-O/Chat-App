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
