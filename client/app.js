const socket = io("https://quickchat-server-hap7.onrender.com");

const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    socket.emit("send-message", input.value);
    input.value = "";
  }
});

socket.on("receive-message", (msg) => {
  const div = document.createElement("div");
  div.innerText = msg;
  messages.appendChild(div);
});