import { render, screen, fireEvent } from '@testing-library/react';
import clevertap from 'clevertap-web-sdk';
import { useLocation, useNavigate } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi, Mock } from 'vitest';

import Sidebar from '@components/molecular/nav-section/vertical/Sidebar';
import { PekoPackages } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/hooks/store');
vi.mock('react-router-dom', async () => {
    const originalModule = await vi.importActual<any>('react-router-dom'); // Proper typing

    return {
        ...originalModule,
        useNavigate: vi.fn(),
        useLocation: vi.fn(() => ({
            pathname: '/mock-path',
            search: '',
            hash: '',
            state: null,
        })),
    };
});
vi.mock('clevertap-web-sdk', () => ({
    default: {
        event: {
            push: vi.fn(),
        },
    },
}));

vi.mock('@components/molecular/nav-section/vertical/SidebarData', async importOriginal => {
    const actual: Object = await importOriginal();
    return {
        ...actual,
        useNavData: vi.fn().mockReturnValue([
            { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
            { key: 'settings', label: 'Settings', path: '/settings' },
            // Add more items as needed
        ]),
    };
});

describe('Sidebar Component', () => {
    const navigate = vi.fn();
    const mockUseAppSelector = useAppSelector as Mock;
    const mockUseLocation = useLocation as Mock;

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(navigate); // Use the mocked navigate
        // mockNavigate.mockClear();
        mockUseAppSelector.mockReturnValue({
            packageName: PekoPackages.Basic,
            role: 'user',
        });
        mockUseLocation.mockReturnValue({ pathname: '/dashboard' });
    });

    it('renders the Sidebar without crashing', () => {
        render(<Sidebar />);
        expect(screen.getByAltText('logo')).toBeInTheDocument();
    });

    it('navigates to the dashboard when the logo is clicked', () => {
        render(<Sidebar />);
        fireEvent.click(screen.getByAltText('logo'));
        expect(navigate).toHaveBeenCalledWith('/dashboard');
    });

    it('calls clevertap.event.push with the correct path when a Menu item is clicked', () => {
        render(<Sidebar />);

        const menuItem = screen.getByText('Dashboard');

        fireEvent.click(menuItem);
        screen.debug(undefined, 2000000);
        expect(clevertap.event.push).toHaveBeenCalledWith('dashboard', {
            Page: 'dashboard',
            Action: 'dashboard clicked',
        });
        expect(navigate).toHaveBeenCalledWith('/dashboard'); // Adjust path if necessary
    });
});
