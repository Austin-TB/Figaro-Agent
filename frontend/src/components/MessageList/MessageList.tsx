import type { Message as MessageType } from '../../types';
import { Message } from '../Message';
import { LoadingMessage } from '../LoadingMessage';
import './MessageList.css';
import { useEffect, useRef, useState } from 'react';

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
}

export const MessageList = ({ messages, loading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Smooth scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages.length]);

  // Track new messages for animation
  useEffect(() => {
    setLastMessageCount(messages.length);
  }, [messages.length]);

  const isNewMessage = (index: number) => {
    return index >= lastMessageCount - 1 && messages.length > lastMessageCount;
  };

  return (
    <div className="message-list">
        {messages.map((msg, index) => (
          <Message 
            key={msg.id} 
            message={msg} 
            isNew={isNewMessage(index)}
            isTyping={loading && index === messages.length - 1}
          />
        ))}
      {loading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
}; 