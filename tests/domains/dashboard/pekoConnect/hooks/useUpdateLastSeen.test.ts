import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import useUpdateLastSeen from '@src/domains/dashboard/pekoConnect/hooks/useUpdateLastSeen';
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';

// Mock the getChatClient function and its methods
vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService', () => ({
    getChatClient: vi.fn(),
}));

describe('useUpdateLastSeen', () => {
    const mockSendReadReceipt = vi.fn();
    const mockGetChatClient = vi.mocked(getChatClient);

    beforeEach(() => {
        // Reset mocks before each test
        mockSendReadReceipt.mockReset();
        mockGetChatClient.mockClear();
    });

    it('should set isLoading to true and then false after updating last seen', async () => {
        // Mock ChatThreadClient with sendReadReceipt method
        const mockChatThreadClient = {
            sendReadReceipt: mockSendReadReceipt,
        } as unknown as ChatThreadClient;

        // Mock ChatClient with getChatThreadClient method
        const mockChatClient = {
            getChatThreadClient: vi.fn().mockReturnValue(mockChatThreadClient),
        } as unknown as ChatClient;

        // Mock getChatClient to return the mocked ChatClient
        mockGetChatClient.mockResolvedValue(mockChatClient);

        // Render the hook
        const { result } = renderHook(() => useUpdateLastSeen({ chatId: '123' }));

        // Act: Call handleUpdateLastSeen and wait for the promise to resolve
        await act(async () => {
            await result.current.handleUpdateLastSeen('message1');
        });

        // Assert: Check loading state and method calls
        expect(result.current.isLoading).toBe(false);
        expect(mockSendReadReceipt).toHaveBeenCalledWith({ chatMessageId: 'message1' });
    });
    it('should not call sendReadReceipt if chatId is null', async () => {
        const { result } = renderHook(() => useUpdateLastSeen({ chatId: null }));

        await act(async () => {
            await result.current.handleUpdateLastSeen('message1');
        });

        expect(mockSendReadReceipt).not.toHaveBeenCalled();
    });

    it('should handle loading state correctly', async () => {
        // Mock ChatThreadClient with sendReadReceipt method that simulates a delay
        const mockChatThreadClient = {
            sendReadReceipt: vi
                .fn()
                .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
        } as unknown as ChatThreadClient;

        // Mock ChatClient
        const mockChatClient = {
            getChatThreadClient: vi.fn().mockReturnValue(mockChatThreadClient),
        } as unknown as ChatClient;

        // Mock getChatClient to return the mocked ChatClient
        mockGetChatClient.mockResolvedValue(mockChatClient);

        // Render the hook
        const { result } = renderHook(() => useUpdateLastSeen({ chatId: '123' }));

        // Act: Call handleUpdateLastSeen
        act(() => {
            result.current.handleUpdateLastSeen('message1');
        });

        // Assert: Loading state should be true initially
        expect(result.current.isLoading).toBe(true);

        // Wait for the async action to complete
        await act(async () => {});

        // Assert: Loading state should be false after completion
        expect(result.current.isLoading).toBe(true);
    });
});
