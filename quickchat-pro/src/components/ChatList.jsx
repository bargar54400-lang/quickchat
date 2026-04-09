import React from "react";

export default function ChatList({ chats, activeChat, onSelect }) {
  return (
    <div className="chatList">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={activeChat.id === chat.id ? "chatItem active" : "chatItem"}
          onClick={() => onSelect(chat)}
        >
          <img src={chat.avatar} alt="" />
          <div className="info">
            <b>{chat.name}</b>
            <p>{chat.lastMessage}</p>
          </div>
          <div className="meta">
            <span>{chat.time}</span>
            {chat.unread > 0 && <div className="badge">{chat.unread}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}