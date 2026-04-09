const socket = io("https://quickchat-server-hap7.onrender.com");

let username = "";
let selectedUser = null;
let lastMsgDiv = null;

// LOAD PROFILE
window.onload = () => {
  const savedName = localStorage.getItem("username");
  const savedImage = localStorage.getItem("profileImage");

  if (savedName) {
    document.getElementById("profileName").value = savedName;
    username = savedName;
  }

  if (savedImage) {
    document.getElementById("preview").src = savedImage;
  }
};

// SAVE PROFILE
function saveProfile() {
  const name = document.getElementById("profileName").value;
  const file = document.getElementById("profileImage").files[0];

  localStorage.setItem("username", name);

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem("profileImage", reader.result);
      document.getElementById("preview").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

// JOIN
function join() {
  username = localStorage.getItem("username") || document.getElementById("username").value;
  socket.emit("join", username);
}

// USERS
socket.on("online-users", (users) => {
  const list = document.getElementById("users");
  list.innerHTML = "";

  Object.keys(users).forEach(id => {
    if (users[id] !== username) {
      const div = document.createElement("div");
      div.innerText = users[id];

      div.onclick = () => {
        selectedUser = id;
        document.getElementById("chatHeader").innerText = users[id];
      };

      list.appendChild(div);
    }
  });
});

// SEND MESSAGE
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && selectedUser) {
    const msg = e.target.value;

    lastMsgDiv = addMessage(msg, "sent", "✔");

    socket.emit("private-message", {
      to: selectedUser,
      message: msg
    });

    e.target.value = "";
  }
});

// RECEIVE
socket.on("receive-message", (data) => {
  addMessage(data.message, "received");
});

// DELIVERED
socket.on("delivered", () => {
  if (lastMsgDiv)
    lastMsgDiv.querySelector(".meta").innerText = "✔✔";
});

// SEEN
socket.on("seen", () => {
  if (lastMsgDiv)
    lastMsgDiv.querySelector(".meta").innerText = "✔✔ Seen";
});

// ADD MESSAGE
function addMessage(msg, type, status = "") {
  const div = document.createElement("div");
  div.classList.add("message", type);

  const profileImage = localStorage.getItem("profileImage");

  let img = "";
  if (type === "sent" && profileImage) {
    img = `<img src="${profileImage}" width="30" style="border-radius:50%">`;
  }

  div.innerHTML = `
    ${img}
    <div>${msg}</div>
    <div class="meta">${status}</div>
  `;

  document.getElementById("messages").appendChild(div);
  return div;
}