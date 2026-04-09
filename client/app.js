const socket = io("https://quickchat-server-hap7.onrender.com");

let username = "";
let selectedUser = null;

function join() {
  username = document.getElementById("username").value;
  socket.emit("join", username);
}

// SEND MESSAGE (ENTER)
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && selectedUser) {
    const msg = e.target.value;

    const msgDiv = addMessage(msg, "sent", "✔");

    socket.emit("private-message", {
      to: selectedUser,
      message: msg
    });

    e.target.value = "";

    // update to delivered after server response
    socket.on("delivered", () => {
      msgDiv.querySelector(".meta").innerText = "✔✔";
    });
  }
});

// ADD MESSAGE UI
function addMessage(msg, type, status = "") {
  const div = document.createElement("div");
  div.classList.add("message", type);

  div.innerHTML = `
    <div>${msg}</div>
    <div class="meta">${status}</div>
  `;

  document.getElementById("messages").appendChild(div);
  return div;
}

// RECEIVE MESSAGE
socket.on("receive-message", (data) => {
  addMessage(data.message, "received");
});

// ONLINE USERS
socket.on("online-users", (users) => {
  const list = document.getElementById("users");
  list.innerHTML = "";

  Object.keys(users).forEach(id => {
    const li = document.createElement("div");
    li.innerText = users[id];
    li.style.cursor = "pointer";

    li.onclick = () => {
      selectedUser = id;
      alert("Chatting with " + users[id]);
    };

    list.appendChild(li);
  });
});