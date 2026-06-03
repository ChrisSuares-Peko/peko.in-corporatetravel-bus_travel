import { ChatThreadProperties } from '@azure/communication-chat';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import useCreateChat from '@src/domains/dashboard/pekoConnect/hooks/useCreateChat';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { fetchChats } from '@src/slices/thunks/fetchChats';

// Mock hooks and actions
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

const mockCreateChatThread = vi.fn();
const mockGetChatThreadClient = vi.fn();
const mockListMessages = vi.fn().mockReturnValue({
    byPage: vi.fn().mockReturnValue({
        next: vi.fn().mockResolvedValue({
            value: [{ id: 'message1', body: 'Hello' }],
        }),
    }),
});

vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService', () => ({
    getChatClient: () => ({
        createChatThread: mockCreateChatThread,
        getChatThreadClient: mockGetChatThreadClient,
    }),
}));

vi.mock('@src/slices/thunks/fetchChats', () => ({
    fetchChats: vi.fn(),
}));

describe('useCreateChat', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Initialize mocks within beforeEach
        mockCreateChatThread.mockResolvedValue({
            chatThread: { id: 'thread1', topic: 'Chat between  and Sender Name' },
        });
        mockGetChatThreadClient.mockReturnValue({
            listMessages: mockListMessages,
        });

        // Mock useAppDispatch
        (useAppDispatch as any).mockReturnValue(mockDispatch);

        // Mock useAppSelector with the correct state structure
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: { acs_user_id: 'mock_user_id' },
                    user: { credential: { companyName: 'My Company' } },
                    chat: { profiles: [] },
                },
            })
        );
    });

    it('should create a chat and return the chat thread', async () => {
        const { result } = renderHook(() => useCreateChat());

        // Act
        let chatThread: ChatThreadProperties | null = null;
        await act(async () => {
            chatThread = await result.current.handleCreateChat('sender_id', 'Sender Name');
        });
        console.log('chatThread', chatThread);

        // Assert
        expect(chatThread).toEqual({ id: 'thread1', topic: 'Chat between  and Sender Name' });
        expect(mockCreateChatThread).toHaveBeenCalledWith(
            { topic: 'Chat between  and Sender Name' },
            {
                participants: [
                    { id: { communicationUserId: 'mock_user_id' }, displayName: '' },
                    { id: { communicationUserId: 'sender_id' }, displayName: 'Sender Name' },
                ],
            }
        );
        expect(mockDispatch).toHaveBeenCalledWith(fetchChats());
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors and show a toast', async () => {
        // Setup mock to throw an error
        mockCreateChatThread.mockRejectedValue(new Error('Failed to create chat'));

        const { result } = renderHook(() => useCreateChat());

        // Act
        let chatThread: ChatThreadProperties | null = null;
        await act(async () => {
            chatThread = await result.current.handleCreateChat('sender_id', 'Sender Name');
        });

        // Assert
        expect(chatThread).toBeNull();
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                variant: 'error',
                description: 'Something went wrong. Please try again later.',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });
});
