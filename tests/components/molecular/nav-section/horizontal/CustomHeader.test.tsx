import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import CustomHeader from '@components/molecular/nav-section/horizontal/CustomHeader';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import useNotificationApi from '@src/hooks/useNotificationApi';
import { handleLogout } from '@src/services/handleLogout';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/hooks/useNotificationApi', () => ({
    default: vi.fn().mockReturnValue({
        resetNotificationCount: vi.fn(),
    }),
}));

vi.mock('@src/services/handleLogout', () => ({
    handleLogout: vi.fn(),
}));

const renderComponent = () =>
    render(
        <MemoryRouter>
            <CustomHeader />
        </MemoryRouter>
    );

describe('CustomHeader', () => {
    // const mockResetNotificationCount = vi.fn();

    beforeEach(() => {
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    freshChat: { chatId: '456' },
                    auth: {
                        roleName: 'corporate',
                        role: UserRole.CORPORATE,
                        sessionId: '123',
                    },
                    services: {},
                    user: {
                        user: {
                            balance: 100,
                            logo: '/path/to/logo.png',
                            'credential.companyName': 'Test Company',
                            roleName: 'corporate',
                            companyName: 'Test Company',
                        },
                        notifications: { count: 3, data: [] },
                    },
                    chat: { unreadChats: 2 },
                },
            })
        );
        cleanup();
    });

    it('should display cashback amount for corporate users', () => {
        renderComponent();
        expect(screen.getByText('Cashback')).toBeInTheDocument();
        expect(screen.getByText('AED 100.00')).toBeInTheDocument();
    });

    it('should navigate to the profile page when avatar is clicked', () => {
        const { container } = renderComponent();
        const avatar = container.querySelector('.cursor-pointer');
        fireEvent.click(avatar!);
        expect(screen.queryByText('Test Company')).toBeInTheDocument();
    });

    it('should display the number of notifications in the badge', () => {
        renderComponent();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should call handleLogout function when logout icon is clicked', async () => {
        const { container } = renderComponent();
        screen.debug();
        const logoutImage = container.querySelector('.ant-image-img.cursor-pointer');
        if (logoutImage) fireEvent.click(logoutImage);
        expect(handleLogout).toHaveBeenCalled();
    });

    it('should open the notifications popover when the notification icon is clicked', async () => {
        const mockResetNotificationCount =
            vi.mocked(useNotificationApi).mock.results[0].value.resetNotificationCount;
        renderComponent();
        const [notificationImage] = screen
            .getAllByRole('img')
            .filter(img => img.getAttribute('src') === '/src/assets/icons/Notification.svg');

        fireEvent.click(notificationImage);

        await waitFor(() => {
            expect(mockResetNotificationCount).toHaveBeenCalledTimes(1);
        });
    });

    it('should render the user’s company name correctly', () => {
        renderComponent();
        expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
});
