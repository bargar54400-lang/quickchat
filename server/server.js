io.on("connection", (socket) => {

  socket.on("send-message", (msg) => {
    io.emit("receive-message", msg);
  });

});