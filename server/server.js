const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("QuickChat server is running 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send-message", (msg) => {
    io.emit("receive-message", msg);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on " + PORT));