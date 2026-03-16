import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingContent: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageList({ messages, isTyping, streamingContent }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping, streamingContent]);

  if (messages.length === 0 && !isTyping && !streamingContent) {
    return (
      <div className="chat-empty">
        <div className="chat-empty__icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </div>
        <h4 className="chat-empty__title">GUNDO Support</h4>
        <p className="chat-empty__desc">Send a message to start a conversation</p>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div key={msg.id} className={`chat-msg chat-msg--${msg.role}`}>
          <div>{msg.content}</div>
          <div className="chat-msg__time">{formatTime(msg.createdAt)}</div>
        </div>
      ))}
      {streamingContent && (
        <div className="chat-msg chat-msg--agent">
          <div>{streamingContent}<span className="chat-cursor">▊</span></div>
        </div>
      )}
      {isTyping && !streamingContent && (
        <div className="chat-typing">
          <div className="chat-typing__dot" />
          <div className="chat-typing__dot" />
          <div className="chat-typing__dot" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
