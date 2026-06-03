import { cleanup, render, screen } from '@testing-library/react';
import { Grid } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect, Mock, afterEach } from 'vitest';

import MobileNav from '@components/molecular/nav-section/mobile-nav/MobileNav';
import useMobileNavData from '@components/molecular/nav-section/mobile-nav/MobileNavData';

vi.mock('@components/molecular/nav-section/mobile-nav/MobileNavData');

describe('MobileNav', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );
    });

    test('renders correct number of navigation items', () => {
        const mockNavData = Array.from({ length: 14 }, (_, i) => ({
            key: `/path-${i}`,
            label: `Label ${i}`,
            icon: `/icon-${i}.svg`,
        }));

        (useMobileNavData as Mock).mockReturnValue(mockNavData);

        render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );

        const navItems = screen.getAllByText(/Label/);
        expect(navItems.length).toBe(12); // Should only render the first 12 items
    });

    test('renders correct Link paths and labels', () => {
        const mockNavData = [
            { key: '/path-1', label: 'Label 1', icon: '/icon-1.svg' },
            { key: '/path-2', label: 'Label 2', icon: '/icon-2.svg' },
        ];

        (useMobileNavData as Mock).mockReturnValue(mockNavData);

        render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );

        const link1 = screen.getByText('Label 1').closest('a');
        expect(link1).toHaveAttribute('href', '/path-1');

        const link2 = screen.getByText('Label 2').closest('a');
        expect(link2).toHaveAttribute('href', '/path-2');
    });

    test('applies correct gutter based on screen size', () => {
        // Mock Grid.useBreakpoint to simulate screen size
        const mockUseBreakpoint = vi.fn().mockReturnValue({ xs: true });
        Grid.useBreakpoint = mockUseBreakpoint;

        const { container } = render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );

        const rowDiv = container.querySelector('.ant-row');
        expect(rowDiv).toHaveClass('mt-3 mb-4');
    });

    test('conditionally applies correct class to SVG based on item key', () => {
        const mockNavData = [
            { key: '/corporate-travel', label: 'Corporate Travel', icon: '/icon.svg' },
            { key: '/dashboard/otherService', label: 'Other Service', icon: '/icon.svg' },
        ];

        (useMobileNavData as Mock).mockReturnValue(mockNavData);

        render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );
        const corporateText = screen.getByText('Corporate Travel');
        const otherText = screen.getByText('Other Service');

        const svgPrimarystrokeElement = corporateText
            .closest('a')
            ?.querySelector('.svg-primary-stroke');
        const svgPrimaryElement = otherText.closest('a')?.querySelector('.svg-primary');
        screen.debug();
        expect(svgPrimarystrokeElement).toBeInTheDocument();
        expect(svgPrimaryElement).toBeInTheDocument();
    });

    test('handles empty navData gracefully', () => {
        (useMobileNavData as Mock).mockReturnValue(null);

        render(
            <MemoryRouter>
                <MobileNav />
            </MemoryRouter>
        );

        const navItems = screen.queryAllByText(/Label/);
        expect(navItems.length).toBe(0);
    });
});
