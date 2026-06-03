import { createAsyncThunk } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@store/store';

export const updateLastMessage = createAsyncThunk(
    'chat/update',
    async ({ chatThreadId, message }: any, { getState }) => {
        if (!chatThreadId || !message) return null;

        const { chats } = (getState() as RootState).reducer.chat;
        const chatIndex = chats.findIndex((chat: any) => chat.threadId === chatThreadId);
        if (chatIndex < 0) return null;

        const updatedChats = chats.map((chat, index) => {
            if (index === chatIndex) {
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
                };
            }
            return chat;
        });

        return updatedChats;
    }
);
