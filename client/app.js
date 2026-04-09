const socket = io("https://quickchat-server-hap7.onrender.com");

let username = "";
let selectedUser = null;
let selectedUserName = "";

// JOIN
function join() {
  username = document.getElementById("username").value;
  socket.emit("join", username);
}

// SELECT USER
socket.on("online-users", (users) => {
  const list = document.getElementById("users");
  list.innerHTML = "";

  Object.keys(users).forEach(id => {
    if (users[id] !== username) {
      const div = document.createElement("div");
      div.innerText = users[id];

      div.onclick = () => {
        selectedUser = id;
        selectedUserName = users[id];

        document.getElementById("chatHeader").innerText =
          selectedUserName;
      };

      list.appendChild(div);
    }
  });
});

// SEND MESSAGE
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && selectedUser) {
    const msg = e.target.value;

    addMessage(msg, "sent");

    socket.emit("private-message", {
      to: selectedUser,
      message: msg
    });

    e.target.value = "";
  }
});

// RECEIVE MESSAGE
socket.on("receive-message", (data) => {
  addMessage(data.message, "received");
});

// ADD MESSAGE UI
function addMessage(msg, type) {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerText = msg;

  document.getElementById("messages").appendChild(div);
}