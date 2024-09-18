import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useChatState } from '../../context/chat-provider';
import axios from 'axios';
import { UserListItem } from '../user-avatar/user-list-item';
import { UserBadgeItem } from '../user-avatar/user-badge-item';

export function GroupChatModal({ children }) {
  const toast = useToast();
  const { user, chats, setChats } = useChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`http://localhost:8000/api/user`, {
        params: { search: query },
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
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/chat/group',
        {
          name: groupChatName,
          users: selectedUsers.map((user) => user._id),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'Group Chat Created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    } catch (err) {
      console.log('err => ', err);
      toast({
        title: 'Failed to create group chat!',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work Sans'
            display='flex'
            justifyContent='center'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Chat Name'
                onChange={(e) => setGroupChatName(e.target.value)}
                mb={3}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Users eg: John, Karen, Foggy'
                onChange={(e) => handleSearch(e.target.value)}
                mb={1}
              />
            </FormControl>

            <Box w='100%' display='flex' flexWrap='wrap'>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResults
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
