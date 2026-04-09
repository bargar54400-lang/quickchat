import React from "react";

export default function MessageBubble({ msg }) {
  return (
    <div className={msg.type === "sent" ? "sent" : "received"}>
      <div className="bubble">
        {msg.text}
        <div className="meta">{msg.time} {msg.status}</div>
      </div>
    </div>
  );
}