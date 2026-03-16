import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatContext } from '../ChatProvider';
import { useChat } from '../hooks/useChat';
import { useChatWidget } from '../hooks/useChatWidget';
import { ChatLauncher } from './ChatLauncher';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './ChatWidget.css';
export function ChatWidget({ title = 'GUNDO Support' }) {
    const { config } = useChatContext();
    const widget = useChatWidget();
    const chat = useChat();
    const position = config.position || 'bottom-right';
    return (_jsxs("div", { className: `chat-widget chat-widget--${position}`, children: [widget.isOpen && !widget.isMinimized && (_jsxs("div", { className: "chat-panel", children: [_jsx(ChatHeader, { title: title, onClose: widget.close, onMinimize: widget.minimize }), _jsx(MessageList, { messages: chat.messages, isTyping: chat.isSending, streamingContent: chat.streamingContent }), _jsx(MessageInput, { onSend: chat.sendMessage, disabled: chat.isSending || chat.isStreaming, placeholder: config.locale === 'es' ? 'Escribe un mensaje...' : 'Write a message...' }), _jsx("div", { className: "chat-powered", children: "Powered by GUNDO" })] })), _jsx(ChatLauncher, { isOpen: widget.isOpen, unreadCount: widget.unreadCount, onClick: widget.toggle })] }));
}
//# sourceMappingURL=ChatWidget.js.map