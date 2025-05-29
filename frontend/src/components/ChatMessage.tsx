import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import './ChatMessage.css';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="typing-indicator">
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'} message-enter`}>
      <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className={`message-author ${isUser ? 'user' : 'assistant'}`}>
            {isUser ? 'You' : 'Figaro'}
          </span>
          {message.timestamp && (
            <span className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="message-body prose prose-invert max-w-none">
          {isLoading ? (
            <TypingIndicator />
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 