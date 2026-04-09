const socket = io("https://quickchat-server-hap7.onrender.com");

// STATE
let username = "";
let selectedUser = null;
let lastMsgDiv = null;

// DOM CACHE (IMPORTANT 🔥)
const profileNameInput = document.getElementById("profileName");
const profileImageInput = document.getElementById("profileImage");
const previewImg = document.getElementById("preview");
const usersList = document.getElementById("users");
const chatHeader = document.getElementById("chatHeader");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

// LOAD PROFILE
window.onload = () => {
  const savedName = localStorage.getItem("username");
  const savedImage = localStorage.getItem("profileImage");

  if (savedName) {
    profileNameInput.value = savedName;
    username = savedName;
  }

  if (savedImage) {
    previewImg.src = savedImage;
  }
};

// SAVE PROFILE
function saveProfile() {
  const name = profileNameInput.value.trim();
  const file = profileImageInput.files[0];

  if (!name) return alert("Enter your name");

  localStorage.setItem("username", name);
  username = name;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
      previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

// JOIN
function join() {
  username =
    localStorage.getItem("username") ||
    document.getElementById("username").value.trim();

  if (!username) return alert("Enter username first");

  socket.emit("join", username);
}

// USERS LIST
socket.on("online-users", (users) => {
  usersList.innerHTML = "";

  Object.entries(users).forEach(([id, name]) => {
    if (name === username) return;

    const div = document.createElement("div");
    div.classList.add("user-item");
    div.innerText = name;

    div.onclick = () => {
      selectedUser = id;
      chatHeader.innerText = name;

      // highlight selected user
      document
        .querySelectorAll(".user-item")
        .forEach(el => el.classList.remove("active"));
      div.classList.add("active");
    };

    usersList.appendChild(div);
  });
});

// SEND MESSAGE
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const msg = messageInput.value.trim();

    if (!msg || !selectedUser) return;

    lastMsgDiv = addMessage(msg, "sent", "✔");

    socket.emit("private-message", {
      to: selectedUser,
      message: msg,
    });

    messageInput.value = "";
  }
});

// RECEIVE MESSAGE
socket.on("receive-message", (data) => {
  addMessage(data.message, "received");
  scrollToBottom();
});

// DELIVERED
socket.on("delivered", () => {
  if (lastMsgDiv) {
    const meta = lastMsgDiv.querySelector(".meta");
    if (meta) meta.innerText = "✔✔";
  }
});

// SEEN
socket.on("seen", () => {
  if (lastMsgDiv) {
    const meta = lastMsgDiv.querySelector(".meta");
    if (meta) meta.innerText = "✔✔ Seen";
  }
});

// ADD MESSAGE
function addMessage(msg, type, status = "") {
  const div = document.createElement("div");
  div.className = `message ${type}`;

  const profileImage = localStorage.getItem("profileImage");

  let img = "";
  if (type === "sent" && profileImage) {
    img = `<img src="${profileImage}" class="avatar">`;
  }

  div.innerHTML = `
    ${img}
    <div class="bubble">${msg}</div>
    <div class="meta">${status}</div>
  `;

  messagesContainer.appendChild(div);
  scrollToBottom();

  return div;
}

// AUTO SCROLL 🔥
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}