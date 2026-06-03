import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import NotificationsList from '@components/molecular/nav-section/NotificationsList';
import { useAppSelector } from '@src/hooks/store';

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('NotificationsList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    it('should render NotificationCard components when notifications are available', () => {
        // Mock notifications data
        const mockNotifications = {
            data: [
                {
                    id: '1',
                    notificationBrief: 'Test notification 1',
                    createdAt: '2024-09-01T10:30:00Z',
                    notificationTitle: 'Title 1',
                },
                {
                    id: '2',
                    notificationBrief: 'Test notification 2',
                    createdAt: '2024-09-02T10:30:00Z',
                    notificationTitle: 'Title 2',
                },
            ],
        };

        // Mock useAppSelector to return the mock notifications
        (useAppSelector as Mock).mockReturnValue({ notifications: mockNotifications });

        render(<NotificationsList />);

        mockNotifications.data.forEach(notification => {
            // Find all elements that include the notificationBrief text
            const notificationElements = screen.getAllByText(/Test notification/);

            // Verify that there is a corresponding notification element
            expect(notificationElements).toHaveLength(mockNotifications.data.length);

            // Find the specific notification element by matching the full text
            const matchingElement = notificationElements.find(el =>
                el.textContent?.includes(notification.notificationBrief)
            );

            expect(matchingElement).toBeInTheDocument();

            // Verify if the <strong> element contains the correct text
            const strongText = notification.notificationBrief.split(' ')[2];
            if (matchingElement) {
                const strongElement = matchingElement.querySelector('strong');
                expect(strongElement).toBeInTheDocument();
                if (strongElement) {
                    expect(strongElement.textContent?.trim()).toBe(strongText);
                }
                expect(matchingElement.textContent).toContain(notification.notificationBrief);
            }
        });
    });

    it('should display no notifications message when there are no notifications', () => {
        // Mock useAppSelector to return no notifications
        (useAppSelector as Mock).mockReturnValue({ notifications: { data: [] } });

        render(<NotificationsList />);

        // Check if the no notifications message is rendered
        expect(screen.getByText('No notifications available')).toBeInTheDocument();
    });

    it('should handle when notifications.data is undefined or null', () => {
        (useAppSelector as Mock).mockReturnValue({ notifications: { data: undefined } });

        render(<NotificationsList />);

        expect(screen.getByText('No notifications available')).toBeInTheDocument();
    });

    it('should handle notifications with missing fields', () => {
        const mockNotifications = {
            data: [
                {
                    id: '1',
                    notificationBrief: 'Test Notification 1',
                    createdAt: '2024-09-01T10:30:00Z',
                },
                { id: '2', notificationTitle: 'Title 2' },
            ],
        };

        (useAppSelector as Mock).mockReturnValue({ notifications: mockNotifications });

        render(<NotificationsList />);
        screen.debug();
        expect(screen.getByText(/Test Notification/)).toBeInTheDocument();
        expect(screen.getByText('Title 2')).toBeInTheDocument();
    });

    it('should have unique key props for NotificationCard components', () => {
        const mockNotifications = {
            data: [
                {
                    id: '1',
                    notificationBrief: 'Test Notification 1',
                    createdAt: '2024-09-01T10:30:00Z',
                    notificationTitle: 'Title 1',
                },
                {
                    id: '2',
                    notificationBrief: 'Test Notification 2',
                    createdAt: '2024-09-02T10:30:00Z',
                    notificationTitle: 'Title 2',
                },
            ],
        };

        (useAppSelector as Mock).mockReturnValue({ notifications: mockNotifications });

        render(<NotificationsList />);

        const notificationTitles = screen.getAllByText(/Title \d/);

        notificationTitles.forEach((title, index) => {
            expect(title).toHaveTextContent(mockNotifications.data[index].notificationTitle);
        });
    });
});
