import { useState, useEffect, useCallback } from 'react';

import { ChatMessage } from '@azure/communication-chat';

import { getChatClient } from '../utils/chatService';

interface GetMessagesResult {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading: boolean;
    isLoadingMore: boolean;
    fetchNext: () => Promise<void>;
    hasMore: boolean;
    error: Error | null;
}

const useGetMessages = (chatThreadId: any): GetMessagesResult => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagedMessages, setPagedMessages] = useState<any>(null);

    useEffect(() => {
        if (!chatThreadId || !hasMore) return;
        const getClient = async () => {
            const client = await getChatClient();
            const chatThreadClient = client.getChatThreadClient(chatThreadId);
            const pagedMessagesIterator = chatThreadClient
                .listMessages({ maxPageSize: 20 })
                .byPage();
            setPagedMessages(pagedMessagesIterator);
        };
        getClient();
    }, [chatThreadId, hasMore]);

    const fetchNext = useCallback(async () => {
        if (!chatThreadId || !hasMore || !pagedMessages) return;
        setIsLoadingMore(true);
        try {
            const page = await pagedMessages.next();
            const { value, done } = page;
            if (done) {
                setHasMore(false);
                setIsLoadingMore(false);
                return;
            }
            setMessages(prev => [...prev, ...value]);
        } catch (err) {
            setError(err as Error);
            setHasMore(false);
        }
        setIsLoadingMore(false);
    }, [chatThreadId, hasMore, pagedMessages]);

    useEffect(() => {
        setIsLoading(true);
        fetchNext();
        setIsLoading(false);
    }, [fetchNext]);

    return {
        messages,
        setMessages,
        isLoading,
        isLoadingMore,
        fetchNext,
        hasMore,
        error,
    };
};

export default useGetMessages;
