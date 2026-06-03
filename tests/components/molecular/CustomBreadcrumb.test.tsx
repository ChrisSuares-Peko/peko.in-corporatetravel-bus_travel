import React from 'react';

import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CustomBreadCrumb from '@components/molecular/breadcrumbs/CustomBreadcrumb';
import useScreenSize from '@src/hooks/useScreenSize';

// Mock the useLocation hook from react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
        Link: ({ to, children }: any) => <a href={to}>{children}</a>,
    };
});

// Mock useScreenSize hook
vi.mock('@src/hooks/useScreenSize', () => ({
    default: vi.fn(),
}));

describe('CustomBreadCrumb', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders breadcrumb items based on pathname', () => {
        const useLocationMock = vi.fn().mockReturnValue({ pathname: '/home/dashboard/details' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: true });

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('capitalizes and formats path segments correctly', () => {
        const useLocationMock = vi.fn().mockReturnValue({ pathname: '/user-profile/edit-profile' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: true });

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('User Profile')).toBeInTheDocument();
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('handles nested routes correctly', () => {
        const useLocationMock = vi
            .fn()
            .mockReturnValue({ pathname: '/orders/order-details/12345' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: true });

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Order Details')).toBeInTheDocument();
        expect(screen.queryByText('12345')).not.toBeInTheDocument(); // UUID should not be rendered
    });

    it('does not render blacklisted routes in breadcrumbs', () => {
        const useLocationMock = vi.fn().mockReturnValue({ pathname: '/payment-success' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: true });

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.queryByText('Payment Success')).not.toBeInTheDocument(); // Blacklisted route should not be rendered
    });

    it('renders breadcrumbs only on medium screen size or larger', () => {
        const useLocationMock = vi.fn().mockReturnValue({ pathname: '/home/about' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: false }); // Small screen size

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.queryByText('Home')).not.toBeInTheDocument();
        expect(screen.queryByText('About')).not.toBeInTheDocument();
    });

    it('renders custom separator between breadcrumb items', () => {
        const useLocationMock = vi.fn().mockReturnValue({ pathname: '/home/settings' });
        const useScreenSizeMock = vi.fn().mockReturnValue({ md: true });

        (useLocation as any).mockImplementation(useLocationMock);
        (useScreenSize as any).mockImplementation(useScreenSizeMock);

        const { container } = render(
            <MemoryRouter>
                <CustomBreadCrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(container.querySelector('.ant-breadcrumb-separator')).toBeInTheDocument();
    });
});
