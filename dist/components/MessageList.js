import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
export function MessageList({ messages, isTyping, streamingContent }) {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, isTyping, streamingContent]);
    if (messages.length === 0 && !isTyping && !streamingContent) {
        return (_jsxs("div", { className: "chat-empty", children: [_jsx("div", { className: "chat-empty__icon", children: _jsx("svg", { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" }) }) }), _jsx("h4", { className: "chat-empty__title", children: "GUNDO Support" }), _jsx("p", { className: "chat-empty__desc", children: "Send a message to start a conversation" })] }));
    }
    return (_jsxs("div", { className: "chat-messages", children: [messages.map((msg) => (_jsxs("div", { className: `chat-msg chat-msg--${msg.role}`, children: [_jsx("div", { children: msg.content }), _jsx("div", { className: "chat-msg__time", children: formatTime(msg.createdAt) })] }, msg.id))), streamingContent && (_jsx("div", { className: "chat-msg chat-msg--agent", children: _jsxs("div", { children: [streamingContent, _jsx("span", { className: "chat-cursor", children: "\u258A" })] }) })), isTyping && !streamingContent && (_jsxs("div", { className: "chat-typing", children: [_jsx("div", { className: "chat-typing__dot" }), _jsx("div", { className: "chat-typing__dot" }), _jsx("div", { className: "chat-typing__dot" })] })), _jsx("div", { ref: bottomRef })] }));
}
//# sourceMappingURL=MessageList.js.map