import { useEffect, useState } from 'react';
import { useChatState } from '../context/chat-provider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { ChatLoading } from './chat-loading';
import { getSender } from '../config/chat-logics';
import { GroupChatModal } from './misc/group-chat-modal';

export function MyChats({ fetchAgain }) {
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useChatState();

  const [loggedUser, setLoggedUser] = useState(null);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/chat', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(data);
    } catch (err) {
      console.log('err => ', err);
      toast({
        title: 'Error fetching the chats',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work Sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<FaPlus />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#f8f8f8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats?.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38b2ac' : '#e8e8e8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
