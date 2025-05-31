import './LoadingMessage.css';

export const LoadingMessage = () => {
  return (
    <div className="loading-message">
      <div className="loading-message__header">Figaro</div>
      <div className="loading-message__content">
        Thinking
        <span className="loading-dots">
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </span>
      </div>
    </div>
  );
}; 