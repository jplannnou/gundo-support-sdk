import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ChatClient } from './api/chat-client';
import type { ChatWidgetConfig, ChatUser } from './types';

interface ChatContextValue {
  config: ChatWidgetConfig;
  client: ChatClient;
  user: ChatUser | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

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

export function ChatProvider({
  projectId,
  apiUrl,
  user,
  getToken,
  theme,
  position,
  locale,
  children,
}: ChatProviderProps) {
  const client = useMemo(() => new ChatClient(apiUrl, getToken), [apiUrl, getToken]);

  const config: ChatWidgetConfig = useMemo(
    () => ({ projectId, apiUrl, user, theme, position, locale }),
    [projectId, apiUrl, user, theme, position, locale],
  );

  const value = useMemo(
    () => ({ config, client, user: user ?? null }),
    [config, client, user],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within <ChatProvider>');
  return ctx;
}
