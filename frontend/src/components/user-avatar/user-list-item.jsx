import { Avatar, Box, Text } from '@chakra-ui/react';

export function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor='pointer'
      bg='#e8e8e8'
      _hover={{ background: '#38b2ac', color: 'white' }}
      w='100%'
      display='flex'
      alignItems='center'
      color='black'
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'
    >
      <Avatar src={user.pic} name={user.name} size='sm' mr={2} />
      <Box>
        <Text fontSize='xs'>
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}
