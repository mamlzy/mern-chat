import { useChatState } from '../context/chat-provider';

export function MyChats() {
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useChatState();

  return <div>MyChats</div>;
}
