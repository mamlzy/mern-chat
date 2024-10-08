import { useState } from 'react';
import { ChatBox } from '../components/chat-box';
import { SideDrawer } from '../components/misc/side-drawer';
import { MyChats } from '../components/my-chats';
import { useChatState } from '../context/chat-provider';
import { Box } from '@chakra-ui/react';

export function ChatPage() {
  const { user } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className='w-full'>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5svh'
        p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
