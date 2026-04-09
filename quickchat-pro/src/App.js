import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://quickchat-server-hap7.onrender.com");

function App() {
  const [users, setUsers] = useState({});
  const [username, setUsername] = useState("User" + Math.floor(Math.random()*1000));
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [lastMsgDiv, setLastMsgDiv] = useState(null);

  // JOIN
  useEffect(() => {
    socket.emit("join", username);
  }, [username]);

  // ONLINE USERS
  useEffect(() => {
    socket.on("online-users", (usersList) => {
      setUsers(usersList);
    });
  }, []);

  // RECEIVE
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages(prev => ({
        ...prev,
        [data.from]: [...(prev[data.from] || []), {
          text: data.message,
          type: "received",
          time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        }]
      }));
    });
  }, []);

  // SEND
  const sendMessage = (text) => {
    if (!selectedUser) return;

    socket.emit("private-message", {
      to: selectedUser,
      message: text
    });

    setMessages(prev => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), {
        text,
        type: "sent",
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        status: "✔"
      }]
    }));
  };

  return (
    <div className="app">
      <Sidebar
        users={users}
        onSelect={setSelectedUser}
        currentUser={username}
      />
      <ChatWindow
        messages={messages[selectedUser] || []}
        onSend={sendMessage}
      />
    </div>
  );
}

export default App;