import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { chatsData } from "./data";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://quickchat-server-hap7.onrender.com");

function App() {
  const [chats, setChats] = useState(chatsData);
  const [activeChat, setActiveChat] = useState(null);
  const [username, setUsername] = useState("User" + Math.floor(Math.random()*1000));

  // JOIN
  useEffect(() => {
    socket.emit("join", username);
  }, [username]);

  // RECEIVE MESSAGE
  useEffect(() => {
    socket.on("receive-message", (data) => {
      const updated = chats.map(chat => {
        if (chat.name === data.from) {
          chat.messages.push({
            text: data.message,
            type: "received",
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
            status: "✓✓"
          });
        }
        return chat;
      });

      setChats([...updated]);
    });
  }, [chats]);

  // SEND
  const sendMessage = (text) => {
    if (!activeChat) return;

    socket.emit("private-message", {
      to: activeChat.socketId,
      message: text
    });

    const updated = chats.map(chat => {
      if (chat.id === activeChat.id) {
        chat.messages.push({
          text,
          type: "sent",
          time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
          status: "✓"
        });
      }
      return chat;
    });

    setChats([...updated]);
  };

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={setActiveChat}
      />
      <ChatWindow chat={activeChat} onSend={sendMessage} />
    </div>
  );
}

export default App;