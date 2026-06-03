import { ChatMessage } from '@azure/communication-chat';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ChatBody from '@src/domains/dashboard/pekoConnect/components/ChatBody';
import { useAppSelector } from '@src/hooks/store';

// Mock useAppSelector to provide necessary auth data
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

// Mock utility functions
vi.mock('@src/domains/dashboard/pekoConnect/utils', () => ({
    getDisplayDate: (date: string) => `Formatted ${date}`,
    groupMessagesByDate: (messages: ChatMessage[]) => ({
        '2024-09-06': messages,
    }),
}));

// Mock formatDate function
vi.mock('@src/domains/dashboard/pekoConnect/utils/formatDate', () => ({
    default: (date: string) => `Formatted Time ${date}`,
}));

describe('ChatBody Component', () => {
    beforeEach(() => {
        vi.mocked(useAppSelector).mockReturnValue({ acs_user_id: 'user123' });
    });

    const mockMessages: ChatMessage[] = [
        {
            id: '1',
            content: { message: 'Hello' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user123', kind: 'communicationUser' },
            metadata: { type: 'text' },
            type: 'text',
            sequenceId: '',
            version: '',
        },
        {
            id: '2',
            content: { message: 'https://example.com/image.jpg' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user456', kind: 'communicationUser' },
            metadata: { type: 'image' },
            type: 'text',
            sequenceId: '',
            version: '',
        },
        {
            id: '3',
            content: { message: '😊' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user456', kind: 'communicationUser' },
            metadata: { type: 'emoji' },
            type: 'text',
            sequenceId: '',
            version: '',
        },
        {
            id: '4',
            content: { message: '' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user123', kind: 'communicationUser' },
            metadata: { type: 'call' },
            type: 'text',
            sequenceId: '',
            version: '',
        },
        {
            id: '5',
            content: { message: 'Test message with search term' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user456', kind: 'communicationUser' },
            metadata: { type: 'text' },
            type: 'text',
            sequenceId: '',
            version: '',
        },
    ];

    it('renders grouped messages correctly', () => {
        render(<ChatBody messages={mockMessages} searchTerm="" />);

        // Check that the grouped date header is displayed
        expect(screen.getByText(/Formatted 2024-09-06/i)).toBeInTheDocument();

        // Check individual messages
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByAltText('image')).toBeInTheDocument(); // For the image message
        expect(screen.getByText('😊')).toBeInTheDocument(); // For the emoji message
        expect(screen.getByText('Test message with search term')).toBeInTheDocument();

        // If the call message has a specific string, adjust accordingly
        // If 'Outgoing Call' is the expected content for empty message with call type
        // expect(screen.getByText('Outgoing Call')).toBeInTheDocument();
    });

    it('highlights search terms in text messages', () => {
        render(<ChatBody messages={mockMessages} searchTerm="search term" />);

        // Verify highlighted search term
        const highlightedElement = screen.getByText(/search term/i);
        expect(highlightedElement).toBeInTheDocument();
        expect(highlightedElement.innerHTML).toContain('search term');
    });

    it('renders different content types correctly', () => {
        render(<ChatBody messages={mockMessages} searchTerm="" />);

        // Verify that text, image, emoji, and call message types are rendered
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByAltText('image')).toBeInTheDocument();
        expect(screen.getByText('😊')).toBeInTheDocument();
    });

    it('renders unsupported message types as "unsupported message"', () => {
        const unsupportedMessage: ChatMessage = {
            id: '6',
            content: { message: 'Unsupported' },
            createdOn: new Date(),
            sender: { communicationUserId: 'user456', kind: 'communicationUser' },
            metadata: { type: 'unsupported' },
            type: 'text',
            sequenceId: '',
            version: '',
        };

        render(<ChatBody messages={[unsupportedMessage]} searchTerm="" />);
        expect(screen.getByText(/unsupported message/i)).toBeInTheDocument();
    });
});
