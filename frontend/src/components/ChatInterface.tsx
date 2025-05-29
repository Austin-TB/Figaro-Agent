import { useState, useEffect, useRef } from 'react';
import { MessageCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatAPI from '../services/api';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Set up periodic connection checks
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    const connected = await ChatAPI.healthCheck();
    setIsConnected(connected);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !isConnected) return;

    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await ChatAPI.sendMessage({
        message: content,
        conversation_history: messages,
      });

      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-interface animated-gradient">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="chat-title">Figaro</h1>
            <p className="chat-subtitle">Your AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="messages-container">
        {!hasMessages ? (
          <div className="welcome-screen">
            <div className="welcome-logo">
              <MessageCircle size={40} />
            </div>
            <h2 className="welcome-title">
              Welcome to Figaro
            </h2>
            <p className="welcome-description">
              Your intelligent AI assistant ready to help with questions, analysis, coding, and more. 
              Start a conversation below!
            </p>
            <div className="features-grid">
              {[
                { title: "🔍 Research & Analysis", desc: "Search web, analyze data, and find insights" },
                { title: "💻 Code & Technical", desc: "Write, debug, and explain code" },
                { title: "📚 Learning & Education", desc: "Explain concepts and answer questions" },
                { title: "🎯 Problem Solving", desc: "Break down complex problems step by step" }
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <ChatMessage 
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date().toISOString(),
                }}
                isLoading={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} className="error-icon" />
          <div className="error-content">
            <p className="error-title">Error</p>
            <p className="error-message">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="error-close"
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!isConnected}
      />
    </div>
  );
};

export default ChatInterface; 