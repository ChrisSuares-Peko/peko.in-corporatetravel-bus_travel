import { ChatMessage } from '@azure/communication-chat';
import { createAsyncThunk } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';
import { RootState } from '@store/store';

import { fetchProfiles } from './fetchProfiles';
// eslint-disable-next-line import/no-cycle
import { getRealtimeUpdates } from './getRealtimeUpdates';
import { listChatThreadMembers } from './listChatThreadMembers';

export const fetchChats = createAsyncThunk('user/chats', async (_, { dispatch, getState }) => {
    const { acs_user_id } = (getState() as RootState).reducer.auth;
    const chatClient = await getChatClient();
    const chatThreadClient = chatClient.listChatThreads();

    dispatch(fetchProfiles());

    const chats: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const page of chatThreadClient.byPage()) {
        // eslint-disable-next-line no-restricted-syntax
        for (const thread of page) {
            if (!thread.deletedOn && thread?.id) {
                chats.push({
                    threadId: thread.id,
                    topic: thread.topic,
                });
            }
        }
    }

    await Promise.all(
        chats.map(async chat => {
            const members = await listChatThreadMembers(chat.threadId);
            const sender = members.find((member: any) => member.userId !== acs_user_id);
            chat.sender = sender;
        })
    );

    let unreadChats = 0;
    await Promise.all(
        chats.map(async chat => {
            const client = chatClient.getChatThreadClient(chat.threadId as string);

            const readReceipts = await client.listReadReceipts({ maxPageSize: 2 }).byPage().next();
            const readReceipt = readReceipts.value.find(
                (r: any) => r?.sender?.communicationUserId === acs_user_id
            );
            const lastReadOn = readReceipt?.readOn || 0;

            const messages = await client.listMessages({ maxPageSize: 11 }).byPage().next();
            const lastMessage: ChatMessage = messages.value[0];

            let unreadCount = 0;
            // eslint-disable-next-line no-restricted-syntax
            for (const m of messages.value) {
                if (m?.sender?.communicationUserId === acs_user_id) break;
                if (m.createdOn > lastReadOn && m.type === 'text') unreadCount += 1;
            }
            chat.unreadCount = unreadCount;

            chat.lastMessage = {
                id: lastMessage.id,
                content: {
                    message: lastMessage?.content?.message || '',
                    attachments: lastMessage?.content?.attachments || [],
                },
                type: 'text',
                metadata: lastMessage?.metadata
                    ? { type: lastMessage.metadata.type }
                    : { type: 'text' },
                createdOn: new Date(lastMessage.createdOn).toISOString(),
            };

            if (unreadCount) unreadChats += 1;
        })
    );

    await chatClient.startRealtimeNotifications();
    chatClient.on('chatMessageReceived', message => {
        const serializableMessage = {
            ...message,
            createdOn: message.createdOn.toISOString(),
        };
        dispatch(getRealtimeUpdates(serializableMessage));
    });

    return { chats, unreadChats, acs_user_id };
});
