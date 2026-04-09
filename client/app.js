const socket = io("https://quickchat-server-hap7.onrender.com");

let username = "";
let selectedUser = null;

function join() {
  username = document.getElementById("username").value;
  socket.emit("join", username);
}

// Send message
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && selectedUser) {
    socket.emit("private-message", {
      to: selectedUser,
      message: e.target.value
    });
    e.target.value = "";
  } else {
    socket.emit("typing", selectedUser);
  }
});

// Receive message
socket.on("receive-message", (data) => {
  const div = document.createElement("div");
  div.innerText = `${data.from}: ${data.message}`;
  document.getElementById("messages").appendChild(div);
});

// Typing
socket.on("typing", (user) => {
  document.getElementById("typing").innerText = user + " is typing...";
  setTimeout(() => {
    document.getElementById("typing").innerText = "";
  }, 1000);
});

// Online users
socket.on("online-users", (users) => {
  const list = document.getElementById("users");
  list.innerHTML = "";

  Object.keys(users).forEach(id => {
    const li = document.createElement("div");
    li.innerText = users[id];
    li.onclick = () => selectedUser = id;
    list.appendChild(li);
  });
});