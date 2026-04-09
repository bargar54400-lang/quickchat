import React, { useRef, useEffect } from "react";
import InputBar from "./InputBar";

export default function ChatWindow({ messages, onSend }) {
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            <div className="bubble">
              {msg.text}
              <div className="meta">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <InputBar onSend={onSend} />

    </div>
  );
}