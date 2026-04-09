const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let users = {};

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("QuickChat Server Running 🚀");
});

// SOCKET
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN
  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(username, "joined");

    io.emit("online-users", users);
  });

  // SEND MESSAGE (BROADCAST VERSION 🔥)
  socket.on("private-message", ({ message }) => {
    io.emit("receive-message", {
      message,
      from: users[socket.id]
    });

    // delivered tick
    socket.emit("delivered");

    // simulate seen
    setTimeout(() => {
      socket.emit("seen");
    }, 1000);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("online-users", users);
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});