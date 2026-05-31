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

