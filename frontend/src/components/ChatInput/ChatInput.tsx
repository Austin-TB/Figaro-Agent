import './ChatInput.css';

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export const ChatInput = ({ input, loading, onInputChange, onSendMessage }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input__container">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input__textarea"
          rows={1}
        />
        <button
          onClick={onSendMessage}
          disabled={!input.trim() || loading}
          className="chat-input__button"
        >
          Send
        </button>
      </div>
    </div>
  );
}; 