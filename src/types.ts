// ── Support Chat SDK Types ──────────────────────────────────────

export type MessageRole = 'user' | 'agent' | 'system';
export type ConversationStatus = 'active' | 'waiting' | 'resolved' | 'closed';

export interface ChatMessage {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Conversation {
  id: number;
  project: string;
  userId: string;
  userName: string | null;
  status: ConversationStatus;
  subject: string | null;
  lastMessageAt: string | null;
  messageCount: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface ChatWidgetConfig {
  projectId: 'engine' | 'finance' | 'radar' | 'jp-assistant';
  apiUrl: string;
  user?: ChatUser;
  theme?: Partial<ChatTheme>;
  position?: 'bottom-right' | 'bottom-left';
  locale?: 'es' | 'en';
}

export interface ChatUser {
  id: string;
  email: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface SendMessageInput {
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}
