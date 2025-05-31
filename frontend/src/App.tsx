import './App.css';
import { MessageList, ChatInput, WelcomeMessage } from './components';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, input, loading, setInput, sendMessage } = useChat();

  return (
    <div className="app">
      <WelcomeMessage noMessages={messages.length === 0} />
      <MessageList messages={messages} loading={loading} />
      <ChatInput 
        input={input}
        loading={loading}
        onInputChange={setInput}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default App;
