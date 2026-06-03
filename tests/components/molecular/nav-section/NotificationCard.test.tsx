import { cleanup, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import NotificationCard from '@components/molecular/nav-section/NotificationCard';

describe('NotificationCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    it('should render the component with basic props', () => {
        const props = {
            notificationTitle: 'New Message',
            notification: 'You have received AED 100.00 from John Doe',
            date: '2024-09-01T10:30:00Z',
        };
        render(<NotificationCard {...props} />);

        expect(screen.getByText('New Message')).toBeInTheDocument();
        expect(screen.getByText(/You have received/)).toBeInTheDocument();
        expect(
            screen.getByText(
                (content, element) =>
                    content.startsWith('AED 100.00') && element?.tagName.toLowerCase() === 'strong'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/from John Doe/)).toBeInTheDocument();
    });

    it('should parse and render the notification text with numeric values highlighted', () => {
        const props = {
            notificationTitle: 'New Transaction',
            notification: 'Your balance is AED 500.50',
            date: '2024-09-01T10:30:00Z',
        };

        render(<NotificationCard {...props} />);

        expect(screen.getByText('New Transaction')).toBeInTheDocument();

        // Assert that the main text and highlighted text are rendered correctly
        expect(
            screen.getByText(
                (content, element) => element?.textContent === 'Your balance is AED 500.50'
            )
        ).toBeInTheDocument();

        // Assert that the highlighted text is within a strong tag
        const strongElement = screen.getByText('AED 500.50');
        expect(strongElement).toBeInTheDocument();
        expect(strongElement.tagName).toBe('STRONG');
    });

    it('should correctly format and display the date', () => {
        const props = {
            notificationTitle: 'New Event',
            notification: 'Event starting soon',
            date: '2024-09-08T10:30:00Z',
        };
        render(<NotificationCard {...props} />);

        const dateElement = screen.getByText('08 Sep at 4:00 PM');

        expect(dateElement).toBeInTheDocument();
    });

    it('should format today’s date as "Today at h:mm A"', () => {
        const props = {
            notificationTitle: 'Reminder',
            notification: 'Your meeting starts soon',
            date: dayjs().toISOString(),
        };
        render(<NotificationCard {...props} />);

        expect(screen.getByText(/Today at/i)).toBeInTheDocument();
    });

    it('should render without errors when notification text is empty', () => {
        const props = {
            notificationTitle: 'Empty Notification',
            notification: '',
            date: '2024-09-01T10:30:00Z',
        };
        render(<NotificationCard {...props} />);

        expect(screen.getByText('Empty Notification')).toBeInTheDocument();
    });
});
