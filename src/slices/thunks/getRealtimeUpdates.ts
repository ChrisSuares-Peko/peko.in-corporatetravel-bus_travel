import { createAsyncThunk } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@store/store';

// eslint-disable-next-line import/no-cycle
import { fetchChats } from './fetchChats';

export const getRealtimeUpdates = createAsyncThunk(
    'chats/updates',
    async (message: any, { dispatch, getState }) => {
        const { acs_user_id } = (getState() as RootState).reducer.auth;
        const senderId = message?.sender?.communicationUserId;

        const { chats } = (getState() as RootState).reducer.chat;

        const threadId = message?.threadId;
        const chatIndex = chats.findIndex((chat: any) => chat.threadId === threadId);
        if (chatIndex < 0) {
            dispatch(fetchChats());
            return { updatedChats: null, unreadCount: 1, message };
        }
        let unreadCount;
        const updatedChats = chats.map((chat, index) => {
            if (index === chatIndex) {
                unreadCount =
                    acs_user_id === senderId ? chat?.unreadCount : (chat?.unreadCount || 0) + 1;
                const newMessage = {
                    ...message,
                    content: {
                        message: message.message,
                        attachments: message.attachments,
                    },
                    type: 'text',
                    metadata: message.metadata,
                    createdOn: new Date(message.createdOn).toISOString(),
                };
                return {
                    ...chat,
                    lastMessage: newMessage,
                    unreadCount,
                };
            }
            return chat;
        });
        return { updatedChats, unreadCount, message };
    }
);
