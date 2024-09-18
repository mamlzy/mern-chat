import { Button } from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';

export function UserBadgeItem({ user, handleFunction }) {
  return (
    <Button
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      colorScheme='purple'
      cursor='pointer'
      h='auto'
      onClick={handleFunction}
    >
      {user.name}
      <IoClose />
    </Button>
  );
}
