export class ChatClient {
    baseUrl;
    getToken;
    constructor(baseUrl, getToken) {
        this.baseUrl = baseUrl;
        this.getToken = getToken;
    }
    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (this.getToken) {
            const token = await this.getToken();
            if (token)
                headers['Authorization'] = `Bearer ${token}`;
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
    async createConversation(project, subject) {
        return this.request('/conversations', {
            method: 'POST',
            body: JSON.stringify({ project, subject }),
        });
    }
    async getConversation(id) {
        return this.request(`/conversations/${id}`);
    }
    async listConversations(project) {
        const qs = project ? `?project=${project}` : '';
        return this.request(`/conversations${qs}`);
    }
    async closeConversation(id) {
        return this.request(`/conversations/${id}/close`, { method: 'POST' });
    }
    // ── Messages ──────────────────────────────────────────────────
    async sendMessage(conversationId, data) {
        return this.request(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async getMessages(conversationId, limit = 50, before) {
        const params = new URLSearchParams({ limit: String(limit) });
        if (before)
            params.set('before', String(before));
        return this.request(`/conversations/${conversationId}/messages?${params}`);
    }
    // ── AI Chat ───────────────────────────────────────────────────
    /** Send a message and get an AI response (non-streaming) */
    async chat(conversationId, content) {
        return this.request(`/conversations/${conversationId}/chat`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    }
    /** Send a message and stream the AI response via SSE */
    async *chatStream(conversationId, content) {
        const url = `${this.baseUrl}/conversations/${conversationId}/stream`;
        const headers = { 'Content-Type': 'application/json' };
        if (this.getToken) {
            const token = await this.getToken();
            if (token)
                headers['Authorization'] = `Bearer ${token}`;
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
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        yield parsed;
                    }
                    catch { /* skip malformed */ }
                }
            }
        }
    }
}
export class ChatApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.name = 'ChatApiError';
        this.status = status;
    }
}
//# sourceMappingURL=chat-client.js.map