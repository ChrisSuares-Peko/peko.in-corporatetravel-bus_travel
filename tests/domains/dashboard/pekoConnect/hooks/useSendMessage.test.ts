import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import useSendMessage from '@src/domains/dashboard/pekoConnect/hooks/useSendMessage';
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock external dependencies
vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService', () => ({
    getChatClient: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

describe('useSendMessage', () => {
    let mockDispatch: any;
    let mockChatClient: any;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Mock the dispatch function
        mockDispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(mockDispatch);

        // Mock the user and auth selectors
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: { id: 'user123' },
                    user: { user: { 'credential.companyName': 'Test Company' } },
                },
            })
        );

        // Mock ChatClient and sendMessage function
        mockChatClient = {
            getChatThreadClient: vi.fn(() => ({
                sendMessage: vi.fn(async () => ({
                    id: 'message123',
                })),
            })),
        };

        // Mock getChatClient to return the mock chat client
        (getChatClient as any).mockResolvedValue(mockChatClient);
    });

    it('should send a message successfully', async () => {
        const { result } = renderHook(() => useSendMessage({ chatThreadId: 'thread123' }));

        await act(async () => {
            const response: any = await result.current.handleSendChatMessage('text', 'Hello World');

            expect(response.id).toBe('message123');
        });

        expect(result.current.isLoading).toBe(false);
        expect(mockChatClient.getChatThreadClient).toHaveBeenCalledWith('thread123');
        expect(mockDispatch).not.toHaveBeenCalledWith(showToast(expect.anything()));
    });

    it('should dispatch error toast if sending a message fails', async () => {
        // Mock sendMessage to throw an error
        mockChatClient.getChatThreadClient = vi.fn(() => ({
            sendMessage: vi.fn(async () => {
                throw new Error('Failed to send message');
            }),
        }));

        const { result } = renderHook(() => useSendMessage({ chatThreadId: 'thread123' }));

        await act(async () => {
            const response = await result.current.handleSendChatMessage('text', 'Hello World');
            expect(response).toBe(null);
        });

        expect(result.current.isLoading).toBe(false);
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({ variant: 'error', description: 'Failed to send message' })
        );
    });

    it('should return null if no chatThreadId is provided', async () => {
        const { result } = renderHook(() => useSendMessage({ chatThreadId: null }));

        await act(async () => {
            const response = await result.current.handleSendChatMessage('text', 'Hello World');
            expect(response).toBe(null);
        });

        expect(result.current.isLoading).toBe(false);
        expect(getChatClient).not.toHaveBeenCalled();
    });
});
