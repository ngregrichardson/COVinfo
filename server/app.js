const express = require("express");
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const path = require("path");

const port = process.env.PORT || 6000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client/build")));

const server = http.createServer(app);

const io = socket(server);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

app.post("/chat/sendMessage", (req, res) => {
  let params = req.query;
  if (!params.username || !params.message || !params.username_color) {
    return res.send({ statusCode: 401, message: "Bad params." }).status(401);
  }
  io.emit("message", params);
  res.send({ statusCode: 200, message: "Sent." }).status(200);
});

io.on("connection", (socket) => {
  console.log("someone connected!");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
