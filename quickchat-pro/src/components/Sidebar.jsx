import React, { useState } from "react";
import ChatList from "./ChatList";

export default function Sidebar({ chats, activeChat, onSelect }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  let filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (tab === "unread") filtered = filtered.filter(c => c.unread > 0);
  if (tab === "favourites") filtered = filtered.filter(c => c.favourite);

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <img src="https://i.pravatar.cc/40" alt="" />
        <div>
          <span>➕</span>
          <span>⋮</span>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search or start a new chat"
        onChange={e => setSearch(e.target.value)}
      />

      <div className="tabs">
        <button onClick={() => setTab("all")}>All</button>
        <button onClick={() => setTab("unread")}>Unread</button>
        <button onClick={() => setTab("favourites")}>Favourites</button>
      </div>

      <ChatList chats={filtered} activeChat={activeChat} onSelect={onSelect} />

    </div>
  );
}