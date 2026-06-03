import { ChatMessage } from '@azure/communication-chat';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import useGetMessages from '@src/domains/dashboard/pekoConnect/hooks/useGetMessages';
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';

// Mock the getChatClient function
vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService', () => ({
    getChatClient: vi.fn(),
}));

describe('useGetMessages', () => {
    let mockGetChatClient: any;
    let mockListMessages: any;
    let mockPagedMessagesIterator: any;

    beforeEach(() => {
        // Mock iterator for paginated messages
        mockPagedMessagesIterator = {
            next: vi.fn(),
        };

        // Mock listMessages to return the paged messages iterator
        mockListMessages = vi.fn().mockReturnValue({
            byPage: () => mockPagedMessagesIterator,
        });

        // Mock getChatClient to return a mock chat client
        mockGetChatClient = getChatClient as any;
        mockGetChatClient.mockResolvedValue({
            getChatThreadClient: vi.fn().mockReturnValue({
                listMessages: mockListMessages,
            }),
        });
    });

    it('should fetch and set messages correctly on initial load', async () => {
        // Define mock messages
        const message1: ChatMessage = {
            id: '1',
            content: { message: 'Hello' },
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
        };
        const message2: ChatMessage = {
            id: '2',
            content: { message: 'World' },
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
        };

        // Mock the behavior of the paged iterator's next function
        mockPagedMessagesIterator.next.mockResolvedValueOnce({
            value: [message1, message2],
            done: false, // Simulates there are more messages to fetch
        });

        // Render the hook with a test thread ID
        const { result } = renderHook(() => useGetMessages('test-thread-id'));

        // Wait for the initial loading state
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        // console.log('Initial loading state:', result.current); // Debug line

        // Wait for loading to complete
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        // console.log('After loading:', result.current); // Debug line

        // Verify that the messages have been set correctly
        expect(result.current.messages).toEqual([message1, message2]);
        expect(result.current.hasMore).toBe(true);
    });

    it('should handle loading more messages when fetchNext is called', async () => {
        // Mock message data
        const message1: ChatMessage = {
            id: '1',
            content: { message: 'Hello' },
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
        };
        const message2: ChatMessage = {
            id: '2',
            content: { message: 'World' },
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
        };
        const message3: ChatMessage = {
            id: '3',
            content: { message: 'Again' },
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
        };
        // Set up mock to simulate pagination
        mockPagedMessagesIterator.next
            .mockResolvedValueOnce({ value: [message1, message2], done: false }) // First call returns two messages
            .mockResolvedValueOnce({ value: [message3], done: false }) // Second call returns one more message
            .mockResolvedValueOnce({ value: [], done: true }); // Third call returns no more messages

        // Render the hook
        const { result } = renderHook(() => useGetMessages('test-thread-id'));

        // Wait for initial load
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check the initial state
        expect(result.current.messages).toEqual([]);

        // Fetch next set of messages
        await act(async () => {
            await result.current.fetchNext();
        });

        // Wait for fetchNext to update the state
        await waitFor(() => {
            // console.log('After first fetchNext:', result.current.messages);
            expect(result.current.messages).toEqual([message1, message2, message3]);
            expect(result.current.hasMore).toBe(true);
        });

        // Fetch the final set of messages
        await act(async () => {
            await result.current.fetchNext();
        });

        // Verify no more messages to fetch
        await waitFor(() => {
            // console.log('After second fetchNext:', result.current.messages);
            expect(result.current.messages).toEqual([message1, message2, message3]);
            expect(result.current.hasMore).toBe(false);
        });
    });

    it('should handle errors during fetching', async () => {
        // Simulate an error when fetching messages
        const error = new Error('Failed to fetch messages');
        mockPagedMessagesIterator.next.mockRejectedValueOnce(error);

        // Render the hook
        const { result } = renderHook(() => useGetMessages('test-thread-id'));

        // Wait for the hook to catch the error
        await waitFor(() => expect(result.current.error).toEqual(error));
        expect(result.current.hasMore).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch if chatThreadId is not provided', async () => {
        // Render the hook without a thread ID
        const { result } = renderHook(() => useGetMessages(null));

        // Check that the hook doesn't attempt to load messages
        expect(result.current.isLoading).toBe(false);
        expect(result.current.messages).toEqual([]);
    });
});
