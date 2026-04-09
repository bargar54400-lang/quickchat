io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("online-users", users);
  });

  socket.on("private-message", ({ to, message }) => {
    socket.to(to).emit("receive-message", {
      message,
      from: users[socket.id],
      senderId: socket.id
    });

    // delivered tick
    socket.emit("delivered");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online-users", users);
  });

});