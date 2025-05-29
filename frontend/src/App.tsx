import './App.css';
import { Header, MessageList, ChatInput } from './components';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, input, loading, setInput, sendMessage } = useChat();

  return (
    <div className="app">
      <Header />
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
