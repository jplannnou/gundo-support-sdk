import { type ReactNode } from 'react';
import { ChatClient } from './api/chat-client';
import type { ChatWidgetConfig, ChatUser } from './types';
interface ChatContextValue {
    config: ChatWidgetConfig;
    client: ChatClient;
    user: ChatUser | null;
}
interface ChatProviderProps {
    projectId: ChatWidgetConfig['projectId'];
    apiUrl: string;
    user?: ChatUser;
    getToken?: () => Promise<string | null>;
    theme?: ChatWidgetConfig['theme'];
    position?: ChatWidgetConfig['position'];
    locale?: ChatWidgetConfig['locale'];
    children: ReactNode;
}
export declare function ChatProvider({ projectId, apiUrl, user, getToken, theme, position, locale, children, }: ChatProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useChatContext(): ChatContextValue;
export {};
//# sourceMappingURL=ChatProvider.d.ts.map