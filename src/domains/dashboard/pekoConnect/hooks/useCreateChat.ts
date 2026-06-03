import { useState } from 'react';

import { ChatThreadProperties } from '@azure/communication-chat';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { fetchChats } from '@src/slices/thunks/fetchChats';

import { getChatClient } from '../utils/chatService';

interface UseCreateChatReturn {
    handleCreateChat: (
        senderId: string,
        senderName: string
    ) => Promise<ChatThreadProperties | null>;
    isLoading: boolean;
}

const useCreateChat = (): UseCreateChatReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { acs_user_id } = useAppSelector(state => state.reducer.auth);
    const { user } = useAppSelector(state => state.reducer.user);
    const { profiles } = useAppSelector(state => state.reducer.chat);
    const dispatch = useAppDispatch();

    const handleCreateChat = async (
        senderId: string,
        senderName: string
    ): Promise<ChatThreadProperties | null> => {
        if (!senderId || !senderName || !acs_user_id) return null;
        setIsLoading(true);

        try {
            const companyName = user?.companyName || '';
            const createChatThreadRequest = {
                topic: `Chat between ${companyName} and ${senderName}`,
            };
            const createChatThreadOptions = {
                participants: [
                    {
                        id: { communicationUserId: acs_user_id },
                        displayName: companyName,
                    },
                    {
                        id: { communicationUserId: senderId }, // reciever
                        displayName: senderName,
                    },
                ],
            };

            const client = await getChatClient();

            const chatThreadResult = await client.createChatThread(
                createChatThreadRequest,
                createChatThreadOptions
            );

            if (!chatThreadResult.chatThread) throw new Error('Chat thread not found');
            const chat = client.getChatThreadClient(chatThreadResult.chatThread.id);
            const messages = await chat.listMessages({ maxPageSize: 1 }).byPage().next();

            dispatch(fetchChats());

            setIsLoading(false);
            return chatThreadResult.chatThread;
        } catch (error) {
            dispatch(
                showToast({
                    variant: 'error',
                    description: 'Something went wrong. Please try again later.',
                })
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    };
    return { handleCreateChat, isLoading };
};

export default useCreateChat;
