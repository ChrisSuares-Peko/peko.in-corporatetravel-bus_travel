import { useEffect, useState } from 'react';

import { getChatClient } from '../utils/chatService';

export const listChatThreadMembers = async (chatThreadId: string): Promise<any[]> => {
    const members: any[] = [];
    try {
        const client = await getChatClient();
        const chatThreadClient = client.getChatThreadClient(chatThreadId);
        // eslint-disable-next-line no-restricted-syntax
        for await (const member of chatThreadClient.listParticipants() as any) {
            members.push({
                userId: member.id.communicationUserId,
                displayName: member.displayName,
            });
        }
    } catch (error) {
        console.error('Failed to list chat thread members:', error);
    }
    return members;
};

export function useGetChats() {
    const [chats, setChats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            const chatThreads: any[] = [];
            setIsLoading(true);
            setError(null);
            try {
                const client = await getChatClient();
                const pagedAsyncIterableIterator = client.listChatThreads();
                // eslint-disable-next-line no-restricted-syntax
                for await (const page of pagedAsyncIterableIterator.byPage()) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const thread of page) {
                        chatThreads.push({
                            threadId: thread.id,
                            topic: thread.topic,
                        });
                    }

                    chatThreads.map(async thread => {
                        const members = await listChatThreadMembers(thread.threadId);
                        thread.members = members;
                    });
                }
                setChats(chatThreads);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                setError(err);
            }
        };
        fetchChats();
    }, []);

    return { chats, isLoading, error };
}
