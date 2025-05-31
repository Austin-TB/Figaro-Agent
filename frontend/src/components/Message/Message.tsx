import type { Message as MessageType } from '../../types';
import './Message.css';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
  isNew?: boolean;
  isTyping?: boolean;
}

export const Message = ({ message, isNew = false, isTyping = false }: MessageProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isNew) {
      setAnimationClass('message--new');
      // Remove the new class after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const messageClass = [
    'message',
    message.role === 'user' ? 'message--user' : 'message--assistant',
    animationClass,
    isTyping ? 'message--typing' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={messageClass}>
      <div className="message__header">
        {message.role === 'user' ? 'You' : 'Rae'}
      </div>
      <div className="message__content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Customize how different elements are rendered
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              
              return isInline ? (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              ) : (
                <pre className="code-block">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            // Style blockquotes
            blockquote: ({ children }) => (
              <blockquote className="markdown-blockquote">
                {children}
              </blockquote>
            ),
            // Style lists
            ul: ({ children }) => (
              <ul className="markdown-list">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="markdown-list">
                {children}
              </ol>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}; 