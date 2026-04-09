import React, { useState } from "react";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="inputBar">
      <span>➕</span>
      <span>😊</span>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
        placeholder="Type a message"
      />

      <span>🎤</span>
    </div>
  );
}