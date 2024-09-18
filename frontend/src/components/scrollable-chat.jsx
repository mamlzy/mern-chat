import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/chat-logics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { useChatState } from '../context/chat-provider';
import { cn } from '../lib/utils';

export function ScrollableChat({ messages }) {
  const { user } = useChatState();

  console.log('messages =>', messages);

  return (
    <ScrollableFeed>
      {messages.map((message, idx) => (
        <div key={idx} className='flex'>
          {(isSameSender(messages, message, idx, user._id) ||
            isLastMessage(messages, idx, user._id)) && (
            <Tooltip
              label={message.sender.name}
              placement='bottom-start'
              hasArrow
            >
              <Avatar
                mt='7px'
                src={message.sender.pic}
                name={message.sender.name}
                cursor='pointer'
                size='sm'
                mr={1}
              />
            </Tooltip>
          )}
          <span
            className={cn(
              'rounded-[20px] py-[5px] px-[15px] max-w-[75%]',
              message.sender._id === user._id ? 'bg-[#bee3f8]' : 'bg-[#b9f5d0]',
            )}
            style={{
              marginLeft: isSameSenderMargin(messages, message, idx, user._id),
              marginTop: isSameUser(messages, message, idx) ? 3 : 10,
            }}
          >
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
}
