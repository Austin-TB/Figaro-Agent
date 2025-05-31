import type { Message as MessageType } from '../../types';
import './Message.css';
import { useEffect, useState } from 'react';

interface MessageProps {
  message: MessageType;
  isNew?: boolean;
  isTyping?: boolean;
}

export const Message = ({ message, isNew = false, isTyping = false }: MessageProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isNew) {
      setAnimationClass('message--new');
      // Remove the new class after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const messageClass = [
    'message',
    message.role === 'user' ? 'message--user' : 'message--assistant',
    animationClass,
    isTyping ? 'message--typing' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={messageClass}>
      <div className="message__header">
        {message.role === 'user' ? 'You' : 'Figaro'}
      </div>
      <div className="message__content">{message.content}</div>
    </div>
  );
}; 