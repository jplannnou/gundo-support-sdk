import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
export function MessageInput({ onSend, disabled, placeholder = 'Write a message...' }) {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);
    const handleSend = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed);
        setValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }, [value, disabled, onSend]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);
    const handleInput = useCallback(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 100) + 'px';
        }
    }, []);
    return (_jsxs("div", { className: "chat-input", children: [_jsx("textarea", { ref: textareaRef, className: "chat-input__textarea", value: value, onChange: (e) => { setValue(e.target.value); handleInput(); }, onKeyDown: handleKeyDown, placeholder: placeholder, rows: 1, disabled: disabled }), _jsx("button", { className: "chat-input__send", onClick: handleSend, disabled: disabled || !value.trim(), "aria-label": "Send", children: _jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) }) })] }));
}
//# sourceMappingURL=MessageInput.js.map