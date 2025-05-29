import { useState } from 'react';
import './App.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          conversation_history: messages 
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Could not connect to server. Make sure the backend is running on port 8000.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '1rem', 
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Figaro AI</h1>
      </header>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666',
            marginTop: '2rem'
          }}>
            <h2>Welcome to Figaro</h2>
            <p>Ask me anything!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: msg.role === 'user' ? '#007bff' : '#fff',
              color: msg.role === 'user' ? 'white' : '#333',
              border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none'
            }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                {msg.role === 'user' ? 'You' : 'Figaro'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          ))
        )}
        
        {loading && (
          <div style={{ 
            alignSelf: 'flex-start',
            maxWidth: '70%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: '#fff',
            border: '1px solid #e0e0e0',
            color: '#666'
          }}>
            <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Figaro</div>
            <div>Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ 
        padding: '1rem',
        background: '#fff',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              resize: 'none',
              minHeight: '2.5rem',
              fontFamily: 'inherit'
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || loading) ? 0.5 : 1
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
