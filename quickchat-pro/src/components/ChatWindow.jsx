import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function ChatWindow({ chat, onSend }) {
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!chat) return <div className="chat">Select chat</div>;

  return (
    <div className="chat">

      <div className="chat-header">
        <img src={chat.avatar} alt="" />
        <div>
          <b>{chat.name}</b>
          <p>last seen today</p>
        </div>
        <div>📹 🔍 ⋮</div>
      </div>

      <div className="messages">
        {chat.messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        <div ref={endRef}></div>
      </div>

      <InputBar onSend={onSend} />

    </div>
  );
}