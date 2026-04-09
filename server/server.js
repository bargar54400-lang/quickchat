const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let users = {};

app.get("/", (req, res) => {
  res.send("QuickChat Pro Running 🚀");
});

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("online-users", users);
  });

  socket.on("private-message", ({ to, message }) => {
    socket.to(to).emit("receive-message", {
      message,
      from: users[socket.id]
    });
  });

  socket.on("typing", (to) => {
    socket.to(to).emit("typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online-users", users);
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT);