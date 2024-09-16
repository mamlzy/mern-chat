import axios from "axios";
import { useEffect, useState } from "react";

export function ChatPage() {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await axios.get("http://localhost:8000/api/chat");

    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
}
