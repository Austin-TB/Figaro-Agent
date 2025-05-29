import type { Message as MessageType } from '../../types';
import { Message } from '../Message';
import { WelcomeMessage } from '../WelcomeMessage';
import { LoadingMessage } from '../LoadingMessage';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
}

export const MessageList = ({ messages, loading }: MessageListProps) => {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))
      )}
      
      {loading && <LoadingMessage />}
    </div>
  );
}; 