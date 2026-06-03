import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetChats } from '@src/domains/dashboard/pekoConnect/hooks/useGetChats';
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';

const mockChatClient = {
    listChatThreads: vi.fn().mockReturnValue({
        byPage: vi.fn().mockResolvedValue([
            {
                value: [
                    { id: 'thread1', topic: 'Topic 1' },
                    { id: 'thread2', topic: 'Topic 2' },
                ],
            },
        ]),
    }),
    getChatThreadClient: vi.fn().mockReturnValue({
        listParticipants: vi.fn().mockResolvedValue([
            { id: { communicationUserId: 'user1' }, displayName: 'User One' },
            { id: { communicationUserId: 'user2' }, displayName: 'User Two' },
        ]),
    }),
};

// Mock the getChatClient function to return mockChatClient
vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService', () => ({
    getChatClient: vi.fn(),
}));

describe('useGetChats', () => {
    beforeEach(() => {
        // Clear mocks before each test
        vi.clearAllMocks();
    });

    it('should set loading state correctly', async () => {
        // Mock getChatClient to return mockChatClient
        const mockGetChatClient = vi.mocked(getChatClient);
        mockGetChatClient.mockResolvedValue(mockChatClient as any);

        const { result } = renderHook(() => useGetChats());

        // Check loading state before fetch completes
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to complete loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('should handle empty chat list', async () => {
        // Mock getChatClient to return an empty list of chat threads
        const mockGetChatClient = vi.fn();
        mockGetChatClient.mockResolvedValue({
            listChatThreads: vi.fn().mockReturnValue({
                byPage: vi.fn().mockResolvedValue([{ value: [] }]),
            }),
            getChatThreadClient: vi.fn().mockReturnValue({
                listParticipants: vi.fn().mockResolvedValue([]),
            }),
        });

        const { result } = renderHook(() => useGetChats());

        // Wait for the hook to complete loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Validate the fetched chats
        expect(result.current.chats).toEqual([]);
    });
});
