import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { ChatClient } from './api/chat-client';
const ChatContext = createContext(null);
export function ChatProvider({ projectId, apiUrl, user, getToken, theme, position, locale, children, }) {
    const client = useMemo(() => new ChatClient(apiUrl, getToken), [apiUrl, getToken]);
    const config = useMemo(() => ({ projectId, apiUrl, user, theme, position, locale }), [projectId, apiUrl, user, theme, position, locale]);
    const value = useMemo(() => ({ config, client, user: user ?? null }), [config, client, user]);
    return _jsx(ChatContext.Provider, { value: value, children: children });
}
export function useChatContext() {
    const ctx = useContext(ChatContext);
    if (!ctx)
        throw new Error('useChatContext must be used within <ChatProvider>');
    return ctx;
}
//# sourceMappingURL=ChatProvider.js.map