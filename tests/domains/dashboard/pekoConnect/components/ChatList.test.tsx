import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { describe, it, expect, vi } from 'vitest';

import ChatList from '@src/domains/dashboard/pekoConnect/components/ChatList';

// Create a mock store
const mockStore = configureMockStore();

const initialState = {
    reducer: {
        chat: {
            chats: [
                {
                    threadId: '1',
                    sender: { userId: '123', displayName: 'John Doe' },
                    lastMessage: {
                        content: { message: 'Hello' },
                        createdOn: new Date().toISOString(),
                    },
                    unreadCount: 1,
                },
            ],
            isLoading: false,
            profiles: [{ acs_user_id: '123', name: 'John Doe', logo: 'path/to/logo.png' }],
            error: null,
        },
        auth: {
            corporateId: 'corporate-123',
        },
    },
};

const store = mockStore(initialState);

describe('ChatList Component', () => {
    it('renders empty state correctly when there are no chats or requests', () => {
        render(
            <Provider store={store}>
                <Router>
                    <ChatList
                        chatId={null}
                        setChatId={() => {}}
                        request={null}
                        setRequest={() => {}}
                        query=""
                        requests={[]}
                        isLoading={false}
                        refresh={() => {}}
                    />
                </Router>
            </Provider>
        );

        // expect(screen.getByText((content, element) => content.includes('1'))).toBeInTheDocument();
        expect(screen.getByText(/Connection/i)).toBeInTheDocument();
    });

    it('renders grouped chats correctly when chats are available', () => {
        const mockChats = [
            { id: '1', name: 'Test Chat' },
            { id: '2', name: 'Another Chat' },
        ];

        render(
            <Provider store={store}>
                <Router>
                    <ChatList
                        chatId={null}
                        setChatId={() => {}}
                        request={null}
                        setRequest={() => {}}
                        query=""
                        requests={mockChats}
                        isLoading={false}
                        refresh={() => {}}
                    />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Pending Request Connections')).toBeInTheDocument();
        expect(screen.getByText('Connection')).toBeInTheDocument();
    });

    it('handles chat selection correctly', () => {
        const setChatIdMock = vi.fn();

        render(
            <Provider store={store}>
                <Router>
                    <ChatList
                        chatId={null}
                        setChatId={setChatIdMock}
                        request={null}
                        setRequest={() => {}}
                        query=""
                        requests={[{ id: '1', name: 'Test Chat' }]}
                        isLoading={false}
                        refresh={() => {}}
                    />
                </Router>
            </Provider>
        );

        // Simulate selecting a chat
        fireEvent.click(screen.getByText('John Doe'));

        expect(setChatIdMock).toHaveBeenCalledWith('1'); // Assuming '1' is the id of the selected chat
    });
});
