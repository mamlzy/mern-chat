import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaBell, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useChatState } from '../../context/chat-provider';
import { ProfileModal } from './profile-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatLoading } from '../chat-loading';
import { UserListItem } from '../user-avatar/user-list-item';
import { getSender } from '../../config/chat-logics';

export function SideDrawer() {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = useChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter a search term!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`http://localhost:8000/api/user`, {
        params: { search },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      console.log('err => ', err);
      toast({
        title: 'Error Occured!',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        `http://localhost:8000/api/chat`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      console.log('err => ', err);
      toast({
        title: 'Error fetching the chat',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <FaSearch />
            <Text display={{ base: 'none', md: 'flex' }} px='4'>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='Work Sans'>
          Talk-A-Tive
        </Text>

        <div className='flex items-center'>
          <Menu>
            <MenuButton p={1}>
              <div className='max-w-max relative'>
                <FaBell className='text-2xl mr-1' />
                {notifications.length > 0 && (
                  <div className='size-6 rounded-full grid place-items-center absolute -right-2 -top-2 bg-red-500 text-white text-sm'>
                    {notifications.length}
                  </div>
                )}
              </div>
            </MenuButton>
            <MenuList pl={2}>
              {notifications.length < 1 && 'No new message'}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications((prev) =>
                      prev.filter((n) => n._id !== notif._id),
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />}>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name or email'
                mr={2}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
