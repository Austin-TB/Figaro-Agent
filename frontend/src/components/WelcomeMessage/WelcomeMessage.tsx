import './WelcomeMessage.css';

interface WelcomeMessageProps {
  noMessages: boolean;
}

export const WelcomeMessage = ({ noMessages }: WelcomeMessageProps) => {
  const isBarMode = !noMessages;

  return (
    <div className={`welcome-message ${isBarMode ? 'bar-mode' : ''}`}>
      <div className={`welcome-bubble ${isBarMode ? 'bar-mode' : ''}`}>
        <div className={`welcome-title ${isBarMode ? 'bar-mode' : ''}`}>Hi I'm Figaro.</div>
        <div className={`welcome-subtitle ${isBarMode ? 'bar-mode' : ''}`}>Ask me Anything!</div>
      </div>
    </div>
  );
}; 