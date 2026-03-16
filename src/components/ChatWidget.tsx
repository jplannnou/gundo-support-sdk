import { useChatContext } from '../ChatProvider';
import { useChat } from '../hooks/useChat';
import { useChatWidget } from '../hooks/useChatWidget';
import { ChatLauncher } from './ChatLauncher';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './ChatWidget.css';

interface ChatWidgetProps {
  title?: string;
}

export function ChatWidget({ title = 'GUNDO Support' }: ChatWidgetProps) {
  const { config } = useChatContext();
  const widget = useChatWidget();
  const chat = useChat();

  const position = config.position || 'bottom-right';

  return (
    <div className={`chat-widget chat-widget--${position}`}>
      {widget.isOpen && !widget.isMinimized && (
        <div className="chat-panel">
          <ChatHeader
            title={title}
            onClose={widget.close}
            onMinimize={widget.minimize}
          />
          <MessageList
            messages={chat.messages}
            isTyping={chat.isSending}
            streamingContent={chat.streamingContent}
          />
          <MessageInput
            onSend={chat.sendMessage}
            disabled={chat.isSending || chat.isStreaming}
            placeholder={config.locale === 'es' ? 'Escribe un mensaje...' : 'Write a message...'}
          />
          <div className="chat-powered">Powered by GUNDO</div>
        </div>
      )}
      <ChatLauncher
        isOpen={widget.isOpen}
        unreadCount={widget.unreadCount}
        onClick={widget.toggle}
      />
    </div>
  );
}
