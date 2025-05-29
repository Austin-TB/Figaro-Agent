import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~5 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const examples = [
    "Explain this youtube video: https://www.youtube.com/watch?v=Qw6b1a2d3e4",
    "What is the capital of France?",
    "Help me write a Python function to sort a list",
    "Analyze this data and find patterns"
  ];

  return (
    <div className="chat-input-container">
      {/* Example prompts */}
      {message === '' && (
        <div className="example-prompts">
          <div className="example-prompts-list">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setMessage(example)}
                className="example-prompt-button"
                disabled={isLoading || disabled}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="input-form-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Figaro anything..."
              className="input-textarea"
              disabled={isLoading || disabled}
              rows={1}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className={`send-button focus-ring ${
                message.trim() && !isLoading && !disabled
                  ? 'enabled btn-glow'
                  : 'disabled'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          
          <div className="input-footer">
            <span className="input-help-text">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className="character-count">
              {message.length}/2000
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput; 