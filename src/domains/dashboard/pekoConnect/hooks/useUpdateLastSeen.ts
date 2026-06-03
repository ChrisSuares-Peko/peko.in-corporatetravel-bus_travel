import { useState } from 'react';

import { getChatClient } from '../utils/chatService';

interface SendMessageProps {
    chatId: string | null;
}

interface UseUpdateLastSeenReturn {
    handleUpdateLastSeen: (messageId: string) => Promise<void>;
    isLoading: boolean;
}

const useUpdateLastSeen = ({ chatId }: SendMessageProps): UseUpdateLastSeenReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUpdateLastSeen = async (messageId: string): Promise<void> => {
        if (!chatId) return;
        setIsLoading(true);

        const client = await getChatClient();
        const chatThreadClient = client.getChatThreadClient(chatId);
        await chatThreadClient.sendReadReceipt({ chatMessageId: messageId });
        setIsLoading(false);
    };
    return { handleUpdateLastSeen, isLoading };
};

export default useUpdateLastSeen;
