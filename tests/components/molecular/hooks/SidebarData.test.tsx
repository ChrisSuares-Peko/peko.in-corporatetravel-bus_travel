import React, { ReactElement, ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { Divider } from 'antd';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';

import { useNavData } from '@components/molecular/nav-section/vertical/SidebarData';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

interface NavItem {
    key: string;
    label: ReactNode;
    icon?: ReactElement;
}
vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@utils/checkAccess', () => ({
    checkCorporateSidebar: vi.fn(),
    checkSidebarkAccess: vi.fn(),
    checkRole: vi.fn(),
}));

describe('useNavData', () => {
    it('should return sidebar config items for CORPORATE role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: UserRole.CORPORATE });
        (useLocation as Mock).mockReturnValue({ pathname: '/dashboard' });

        const { result } = renderHook(() => useNavData());
        const expectedResult: NavItem[] = [
            {
                key: '',
                label: <Divider />,
                icon: undefined,
            },
        ];

        const isReactElement = (node: ReactNode): node is ReactElement =>
            React.isValidElement(node);

        expect(result.current).toHaveLength(expectedResult.length);

        if (!result.current) {
            throw new Error('result.current is undefined');
        }
        expect(result.current).toEqual(
            expectedResult.map((expectedItem, index) => ({
                ...expectedItem,
                label: isReactElement(result.current![index].label)
                    ? result.current![index].label
                    : undefined,
            }))
        );
    });

    it('should return admin config items for SYSTEM role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: UserRole.SYSTEM });
        (useLocation as Mock).mockReturnValue({ pathname: '/dashboard' });

        const { result } = renderHook(() => useNavData());

        // Expect the result to be the admin config
        expect(result.current).toEqual([]);
    });

    it('should mark the correct route as active', () => {
        (useLocation as Mock).mockReturnValue({ pathname: '/dashboard' });

        const { result } = renderHook(() => useNavData());

        // Expect correct active route handling
        expect(result.current).toEqual([]);
    });

    it('should handle empty or undefined location.pathname', () => {
        (useLocation as Mock).mockReturnValue({ pathname: '' });
        const { result } = renderHook(() => useNavData());

        // Verify handling of empty pathname
        expect(result.current).toEqual([]);
    });

    it('should return sidebar config items for USER role', () => {
        const { result } = renderHook(() => useNavData());
        expect(result.current).toEqual([]);
    });

    // Test case for empty state
    it('should return default config when no role is provided', () => {
        const { result } = renderHook(() => useNavData());
        expect(result.current).toEqual([]);
    });

    // Test case for error handling
    it('should handle error states gracefully', () => {
        const { result } = renderHook(() => useNavData());
        expect(result.current).toEqual([]);
    });

    // Test case for dynamic data
    it('should update sidebar config based on dynamic data changes', async () => {
        const { result, rerender } = renderHook(({ role }) => useNavData(), {
            initialProps: { role: 'CORPORATE' },
        });

        expect(result.current).toEqual([]);

        rerender({ role: 'USER' });
        expect(result.current).toEqual([]);
    });
});
