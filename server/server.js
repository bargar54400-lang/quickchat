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

let users = {}; // socket.id => username

app.get("/", (req, res) => {
  res.send("Private Chat Server Running 🚀");
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // JOIN
  socket.on("join", (username) => {
    users[socket.id] = username;

    // send full user list
    io.emit("online-users", users);
  });

  // PRIVATE MESSAGE 🔥
  socket.on("private-message", ({ to, message }) => {

    // send to receiver
    socket.to(to).emit("receive-message", {
      message,
      from: users[socket.id],
      senderId: socket.id
    });

    // sender gets delivered
    socket.emit("delivered");

    // simulate seen
    setTimeout(() => {
      socket.emit("seen");
    }, 1000);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online-users", users);
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});