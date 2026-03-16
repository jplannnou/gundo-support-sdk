import type { Conversation, ChatMessage, SendMessageInput, ConversationListResponse } from '../types';
export declare class ChatClient {
    private baseUrl;
    private getToken?;
    constructor(baseUrl: string, getToken?: () => Promise<string | null>);
    private request;
    createConversation(project: string, subject?: string): Promise<Conversation>;
    getConversation(id: number): Promise<Conversation & {
        messages: ChatMessage[];
    }>;
    listConversations(project?: string): Promise<ConversationListResponse>;
    closeConversation(id: number): Promise<Conversation>;
    sendMessage(conversationId: number, data: SendMessageInput): Promise<ChatMessage>;
    getMessages(conversationId: number, limit?: number, before?: number): Promise<ChatMessage[]>;
    /** Send a message and get an AI response (non-streaming) */
    chat(conversationId: number, content: string): Promise<{
        userMessage: ChatMessage;
        agentMessage: ChatMessage;
        intent: string;
        confidence: number;
        shouldEscalate: boolean;
        escalationReason?: string;
        citations: Array<{
            text: string;
            source: string;
        }>;
    }>;
    /** Send a message and stream the AI response via SSE */
    chatStream(conversationId: number, content: string): AsyncGenerator<{
        type: 'user-message' | 'chunk' | 'done' | 'error';
        data: unknown;
    }>;
}
export declare class ChatApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
//# sourceMappingURL=chat-client.d.ts.map