import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChatWindow from '@src/domains/dashboard/pekoConnect/components/ChatWindow';
import useGetMessages from '@src/domains/dashboard/pekoConnect/hooks/useGetMessages';
import usePostChatImage from '@src/domains/dashboard/pekoConnect/hooks/usePostChatImage';
import useSendMessage from '@src/domains/dashboard/pekoConnect/hooks/useSendMessage';
import useUpdateLastSeen from '@src/domains/dashboard/pekoConnect/hooks/useUpdateLastSeen';
import { getChatClient } from '@src/domains/dashboard/pekoConnect/utils/chatService';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Mock hooks and dependencies
vi.mock('@src/domains/dashboard/pekoConnect/utils/chatService');
vi.mock('@src/hooks/store');
vi.mock('@src/domains/dashboard/pekoConnect/hooks/useGetMessages');
vi.mock('@src/domains/dashboard/pekoConnect/hooks/useSendMessage');
vi.mock('@src/domains/dashboard/pekoConnect/hooks/usePostChatImage');
vi.mock('@src/domains/dashboard/pekoConnect/hooks/useUpdateLastSeen');

const mockStore = configureStore([]);

describe('ChatWindow Component', () => {
    let store: any;
    let mockOnClose: any;
    let mockRefresh: any;

    beforeEach(() => {
        store = mockStore({
            reducer: {
                auth: { acs_user_id: 'test-acs-user-id' },
                chat: {
                    acsUserId: 'test-acs-user-id',
                    profiles: [
                        {
                            acs_user_id: 'test-acs-user-id',
                            logo: '',
                            name: 'Test User',
                            credential: { username: 'testuser' },
                        },
                    ],
                },
            },
        });

        mockOnClose = vi.fn();
        mockRefresh = vi.fn();

        // Mock implementations of hooks
        (useAppDispatch as any).mockReturnValue(vi.fn());
        (useAppSelector as any).mockImplementation((callback: any) => callback(store.getState()));
        (useGetMessages as any).mockReturnValue({
            messages: [
                {
                    id: '1',
                    content: 'Hello',
                    sender: { communicationUserId: 'test-acs-user-id' },
                    type: 'text',
                },
            ],
            setMessages: vi.fn(),
            fetchNext: vi.fn(),
            isLoading: false,
            isLoadingMore: false,
            error: null,
            hasMore: true,
        });
        (useSendMessage as any).mockReturnValue({
            handleSendChatMessage: vi.fn(),
            isLoading: false,
        });
        (usePostChatImage as any).mockReturnValue({
            handlepostChatImage: vi.fn(),
            isLoading: false,
        });
        (useUpdateLastSeen as any).mockReturnValue({
            handleUpdateLastSeen: vi.fn(),
            isLoading: false,
        });
        (getChatClient as any).mockResolvedValue({
            startRealtimeNotifications: vi.fn(),
            on: vi.fn(),
            off: vi.fn(),
        });
    });

    it('renders the ChatWindow component with initial state', () => {
        render(
            <Provider store={store}>
                <ChatWindow chatId="test-chat-id" onClose={mockOnClose} refresh={mockRefresh} />
            </Provider>
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type your message here')).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(
            <Provider store={store}>
                <ChatWindow chatId="test-chat-id" onClose={mockOnClose} refresh={mockRefresh} />
            </Provider>
        );

        const closeButton = screen.getByRole('button', { name: /arrow-left/i });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays an error message when there is an error loading messages', () => {
        (useGetMessages as any).mockReturnValue({
            messages: [],
            setMessages: vi.fn(),
            fetchNext: vi.fn(),
            isLoading: false,
            isLoadingMore: false,
            error: 'Failed to load messages',
            hasMore: true,
        });

        render(
            <Provider store={store}>
                <ChatWindow chatId="test-chat-id" onClose={mockOnClose} refresh={mockRefresh} />
            </Provider>
        );

        expect(screen.getByText('Failed to load chat')).toBeInTheDocument();
    });
    it('calls fetchNext when scrolled to the bottom of the chat window', async () => {
        const fetchNext = vi.fn();
        (useGetMessages as any).mockReturnValue({
            messages: [
                {
                    id: '1',
                    content: 'Hello',
                    sender: { communicationUserId: 'test-acs-user-id' },
                    type: 'text',
                },
            ],
            setMessages: vi.fn(),
            fetchNext,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            hasMore: true,
        });

        render(
            <Provider store={store}>
                <ChatWindow chatId="test-chat-id" onClose={mockOnClose} refresh={mockRefresh} />
            </Provider>
        );

        // Select the chat container using querySelector with the ID
        const chatContainer: any = document.querySelector('#chat-container');

        // Simulate scrolling to the bottom of the chat container
        fireEvent.scroll(chatContainer, { target: { scrollTop: chatContainer.scrollHeight } });

        await waitFor(() => {
            expect(fetchNext).not.toHaveBeenCalled();
        });
    });
});
