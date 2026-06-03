import { useState } from 'react';

import { SendMessageOptions, SendMessageRequest } from '@azure/communication-chat';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getChatClient } from '../utils/chatService';

interface SendMessageProps {
    chatThreadId: string | null;
}

interface MessageData {
    sender: string;
    content: string;
    timestamp: number;
    id?: string;
}

interface UseSendMessageReturn {
    handleSendChatMessage: (
        type: string,
        message: string,
        chatThreadId2?: string
    ) => Promise<MessageData | null>;
    isLoading: boolean;
}

const useSendMessage = ({ chatThreadId }: SendMessageProps): UseSendMessageReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.reducer.user);

    const handleSendChatMessage = async (
        type: string,
        message: string,
        chatThreadId2?: string
    ): Promise<any | null> => {
        if ((!chatThreadId && !chatThreadId2) || !id) return null;
        setIsLoading(true);
        const chatThreadId3 = chatThreadId || chatThreadId2;
        if (!chatThreadId3) return null;

        try {
            const client = await getChatClient();
            const chatThreadClient = client.getChatThreadClient(chatThreadId3);

            const sendMessageRequest: SendMessageRequest = {
                content: message,
            };
            const options: SendMessageOptions = {
                senderDisplayName: user?.companyName,
                type: 'text',
                metadata: { type },
            };
            const messageData = await chatThreadClient.sendMessage(sendMessageRequest, options);
            return messageData;
        } catch (error) {
            dispatch(showToast({ variant: 'error', description: 'Failed to send message' }));
            return null;
        } finally {
            setIsLoading(false);
        }
    };
    return { handleSendChatMessage, isLoading };
};

export default useSendMessage;
