import type { Conversation, ChatMessage } from '../types';
export interface UseChatReturn {
    conversation: Conversation | null;
    messages: ChatMessage[];
    isLoading: boolean;
    isSending: boolean;
    isStreaming: boolean;
    streamingContent: string;
    error: Error | null;
    sendMessage: (content: string) => Promise<void>;
    startConversation: (subject?: string) => Promise<void>;
    closeConversation: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}
export declare function useChat(): UseChatReturn;
//# sourceMappingURL=useChat.d.ts.map