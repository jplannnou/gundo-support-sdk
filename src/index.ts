// ── Provider ────────────────────────────────────────────────────
export { ChatProvider, useChatContext } from './ChatProvider';

// ── Client ──────────────────────────────────────────────────────
export { ChatClient, ChatApiError } from './api/chat-client';

// ── Hooks ───────────────────────────────────────────────────────
export { useChat } from './hooks/useChat';
export type { UseChatReturn } from './hooks/useChat';
export { useChatWidget } from './hooks/useChatWidget';
export type { UseChatWidgetReturn } from './hooks/useChatWidget';

// ── Components ──────────────────────────────────────────────────
export { ChatWidget } from './components/ChatWidget';
export { ChatLauncher } from './components/ChatLauncher';
export { ChatHeader } from './components/ChatHeader';
export { MessageList } from './components/MessageList';
export { MessageInput } from './components/MessageInput';

// ── Types ───────────────────────────────────────────────────────
export type {
  MessageRole,
  ConversationStatus,
  ChatMessage,
  Conversation,
  ChatTheme,
  ChatWidgetConfig,
  ChatUser,
  SendMessageInput,
  ConversationListResponse,
} from './types';
