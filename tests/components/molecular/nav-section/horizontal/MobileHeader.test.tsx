import { render, screen, fireEvent } from '@testing-library/react';
import { describe, beforeEach, test, expect, vi, Mock } from 'vitest';

import MobileHeader from '@components/molecular/nav-section/horizontal/MobileHeader';
import { useAppSelector } from '@src/hooks/store';
import { handleLogout } from '@src/services/handleLogout';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
        <a
            href={to}
            onClick={e => {
                e.preventDefault();
                mockNavigate(to);
            }}
        >
            {children}
        </a>
    ),
}));

vi.mock('@src/hooks/useNotificationApi', () => ({
    default: () => ({
        resetNotificationCount: vi.fn(),
    }),
}));

vi.mock('@src/services/handleLogout', () => ({
    handleLogout: vi.fn(),
}));

describe('MobileHeader', () => {
    // const mockNavigate = vi.fn();

    beforeEach(() => {
        (useAppSelector as Mock).mockImplementation(callback =>
            callback({
                reducer: {
                    user: {
                        user: {
                            roleName: 'corporate',
                            logo: '',
                            'credential.companyName': 'Company',
                        },
                        notifications: { count: 5 },
                    },
                    auth: { role: 'corporate' },
                    chat: { unreadChats: 2, pendingRequests: 3 },
                },
            })
        );
        vi.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<MobileHeader />);
        expect(screen.getByAltText('logo')).toBeInTheDocument();
    });

    test('clicking the logo navigates to home', () => {
        render(<MobileHeader />);
        fireEvent.click(screen.getByAltText('logo'));
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test('clicking the support icon navigates to help page', () => {
        render(<MobileHeader />);
        const supportIcon = screen.getByAltText('Support icon');

        fireEvent.click(supportIcon);
        expect(mockNavigate).toHaveBeenCalledWith('/need-help');
    });

    test('clicking on PekoConnect icon navigates to PekoConnect page if user role is corporate', () => {
        render(<MobileHeader />);
        // screen.debug(undefined, 2000000);
        fireEvent.click(screen.getByAltText('pekoConnect'));

        expect(mockNavigate).toHaveBeenCalledWith('/more-services/peko-connect');
    });

    test('clicking the notification icon resets notification count and navigates to notifications page', () => {
        render(<MobileHeader />);
        fireEvent.click(screen.getByAltText('NotificationIcon'));
        expect(screen.getByAltText('NotificationIcon')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/notifications');
    });

    test('profile avatar navigates to correct profile page based on user role', () => {
        render(<MobileHeader />);
        fireEvent.click(screen.getByAltText('profile')); // Assuming 'C' is the initial
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    test('logout icon triggers handleLogout function', async () => {
        (useAppSelector as Mock).mockImplementation(callback =>
            callback({
                reducer: {
                    user: {
                        user: {
                            roleName: 'corporate',
                            logo: '',
                            'credential.companyName': 'Company',
                        },
                        notifications: { count: 5 },
                    },
                    auth: { role: 'system_user' },
                    chat: { unreadChats: 2, pendingRequests: 3 },
                },
            })
        );
        render(<MobileHeader />);
        fireEvent.click(screen.getByAltText('LogoutIcon'));
        expect(handleLogout).toHaveBeenCalled();
    });
});
