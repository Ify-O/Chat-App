const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let messages = [];

app.get("/messages", (req, res) => {
  res.json(messages);
});
