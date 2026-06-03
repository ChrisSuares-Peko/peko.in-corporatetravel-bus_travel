import { Sender } from '@customtypes/general';
// eslint-disable-next-line import/no-cycle
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';

export const listChatThreadMembers = async (chatThreadId: string): Promise<any[]> => {
    const members: Sender[] = [];
    try {
        const chatClient = await getChatClient();
        const chatThreadClient = chatClient.getChatThreadClient(chatThreadId);
        // eslint-disable-next-line no-restricted-syntax
        for await (const member of chatThreadClient.listParticipants()) {
            const { id, displayName } = member;
            const userId = (id as any).communicationUserId;
            members.push({ userId, displayName });
        }
    } catch (error) {
        console.error('Failed to list chat thread members:', error);
    }
    return members;
};
