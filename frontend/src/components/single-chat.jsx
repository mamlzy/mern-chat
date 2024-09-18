import { Box, IconButton, Text } from '@chakra-ui/react';
import { useChatState } from '../context/chat-provider';
import { FaArrowLeft } from 'react-icons/fa';
import { getSender, getSenderFull } from '../config/chat-logics';
import { ProfileModal } from './misc/profile-modal';
import { UpdateGroupChatModal } from './misc/update-group-chat-modal';

export function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = useChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work Sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<FaArrowLeft />}
              onClick={() => setSelectedChat(null)}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}{' '}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}{' '}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            bg='#e8e8e8'
            overflowY='hidden'
            borderRadius='lg'
            w='100%'
            h='100%'
            p={3}
          >
            {/* Messages here */}
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          h='100%'
          justifyContent='center'
          alignItems='center'
        >
          <Text fontSize='3xl' pb={3} fontFamily='Work Sans'>
            Select a chat to start chatting{' '}
          </Text>
        </Box>
      )}
    </>
  );
}
