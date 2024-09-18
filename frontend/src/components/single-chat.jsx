import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useChatState } from '../context/chat-provider';
import { FaArrowLeft } from 'react-icons/fa';
import { getSender, getSenderFull } from '../config/chat-logics';
import { ProfileModal } from './misc/profile-modal';
import { UpdateGroupChatModal } from './misc/update-group-chat-modal';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import typingsAnimation from '../animations/typings.json';
import axios from 'axios';
import { ScrollableChat } from './scrollable-chat';

const ENDPOINT = 'http://localhost:8000';
let socket, selectedChatCompare;

export function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = useChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingsAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (err) {
      console.log('err => ', err);
      toast({
        title: 'Error fetching the messages',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      console.log({ selectedChatCompare, newMessageReceived });
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });
  }, []);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        setNewMessage('');
        const { data } = await axios.post(
          `http://localhost:8000/api/message`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        console.log('data =>', data);

        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (err) {
        console.log('err => ', err);
        toast({
          title: 'Failed to send message!',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
                  fetchMessages={fetchMessages}
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
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div
                className='flex flex-col overflow-y-scroll '
                style={{ scrollbarWidth: 'none' }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : null}
              <Input
                variant='filled'
                bg='#e0e0e0'
                placeholder='Enter a message..'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
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
