import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../ChatProvider';
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

export function useChat(): UseChatReturn {
  const { client, config } = useChatContext();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startConversation = useCallback(async (subject?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const conv = await client.createConversation(config.projectId, subject);
      setConversation(conv);
      setMessages([]);
      setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [client, config.projectId]);

  const sendMessage = useCallback(async (content: string) => {
    let convId = conversation?.id;

    // Auto-create conversation on first message
    if (!convId) {
      setIsLoading(true);
      try {
        const conv = await client.createConversation(config.projectId);
        setConversation(conv);
        convId = conv.id;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    setIsSending(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      let accumulated = '';
      for await (const event of client.chatStream(convId, content)) {
        switch (event.type) {
          case 'user-message':
            setMessages((prev) => [...prev, event.data as ChatMessage]);
            setIsSending(false);
            break;
          case 'chunk':
            accumulated += event.data as string;
            setStreamingContent(accumulated);
            break;
          case 'done': {
            const agentMsg = event.data as ChatMessage;
            setMessages((prev) => [...prev, agentMsg]);
            setStreamingContent('');
            setIsStreaming(false);
            break;
          }
          case 'error':
            setError(new Error(event.data as string));
            setIsStreaming(false);
            break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSending(false);
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [client, config.projectId, conversation]);

  const closeConversation = useCallback(async () => {
    if (!conversation) return;
    try {
      await client.closeConversation(conversation.id);
      setConversation((prev) => prev ? { ...prev, status: 'closed' } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [client, conversation]);

  const loadMore = useCallback(async () => {
    if (!conversation || !hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const oldest = messages[0];
      const older = await client.getMessages(conversation.id, 50, oldest?.id);
      if (older.length < 50) setHasMore(false);
      setMessages((prev) => [...older, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [client, conversation, hasMore, isLoading, messages]);

  // Disable polling when streaming is active — WebSocket handles real-time
  useEffect(() => {
    if (!conversation || conversation.status === 'closed' || isStreaming) return;

    const poll = async () => {
      try {
        const latest = await client.getMessages(conversation.id, 50);
        setMessages(latest);
      } catch { /* ignore polling errors */ }
    };

    pollingRef.current = setInterval(poll, 8000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [client, conversation, isStreaming]);

  return {
    conversation,
    messages,
    isLoading,
    isSending,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    startConversation,
    closeConversation,
    loadMore,
    hasMore,
  };
}
