import type { Message as MessageType } from '../../types';
import './Message.css';

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const messageClass = `message ${message.role === 'user' ? 'message--user' : 'message--assistant'}`;
  
  return (
    <div className={messageClass}>
      <div className="message__header">
        {message.role === 'user' ? 'You' : 'Figaro'}
      </div>
      <div className="message__content">{message.content}</div>
    </div>
  );
}; 