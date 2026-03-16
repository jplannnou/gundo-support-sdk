import type {
  Conversation,
  ChatMessage,
  SendMessageInput,
  ConversationListResponse,
} from '../types';

export class ChatClient {
  private baseUrl: string;
  private getToken?: () => Promise<string | null>;

  constructor(baseUrl: string, getToken?: () => Promise<string | null>) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ChatApiError(res.status, body.message || res.statusText);
    }

    return res.json();
  }

  // ── Conversations ─────────────────────────────────────────────

  async createConversation(project: string, subject?: string) {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ project, subject }),
    });
  }

  async getConversation(id: number) {
    return this.request<Conversation & { messages: ChatMessage[] }>(`/conversations/${id}`);
  }

  async listConversations(project?: string) {
    const qs = project ? `?project=${project}` : '';
    return this.request<ConversationListResponse>(`/conversations${qs}`);
  }

  async closeConversation(id: number) {
    return this.request<Conversation>(`/conversations/${id}/close`, { method: 'POST' });
  }

  // ── Messages ──────────────────────────────────────────────────

  async sendMessage(conversationId: number, data: SendMessageInput) {
    return this.request<ChatMessage>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(conversationId: number, limit = 50, before?: number) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set('before', String(before));
    return this.request<ChatMessage[]>(`/conversations/${conversationId}/messages?${params}`);
  }

  // ── AI Chat ───────────────────────────────────────────────────

  /** Send a message and get an AI response (non-streaming) */
  async chat(conversationId: number, content: string) {
    return this.request<{
      userMessage: ChatMessage;
      agentMessage: ChatMessage;
      intent: string;
      confidence: number;
      shouldEscalate: boolean;
      escalationReason?: string;
      citations: Array<{ text: string; source: string }>;
    }>(`/conversations/${conversationId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  /** Send a message and stream the AI response via SSE */
  async *chatStream(conversationId: number, content: string): AsyncGenerator<{
    type: 'user-message' | 'chunk' | 'done' | 'error';
    data: unknown;
  }> {
    const url = `${this.baseUrl}/conversations/${conversationId}/stream`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content }),
      credentials: 'include',
    });

    if (!res.ok || !res.body) {
      throw new ChatApiError(res.status, 'Stream failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6));
            yield parsed;
          } catch { /* skip malformed */ }
        }
      }
    }
  }
}

export class ChatApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ChatApiError';
    this.status = status;
  }
}
