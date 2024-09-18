import { Skeleton, Stack } from '@chakra-ui/react';

export function ChatLoading() {
  return (
    <Stack>
      <Skeleton height='45px' />
      <Skeleton height='45px' />
      <Skeleton height='45px' />
      <Skeleton height='45px' />
      <Skeleton height='45px' />
      <Skeleton height='45px' />
      <Skeleton height='45px' />
    </Stack>
  );
}
