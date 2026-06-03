import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getDashboardData } from '@domains/dashboard/Invoice/api';
import useDashboard from '@domains/dashboard/Invoice/hooks/UseDashboard';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getDashboardData: vi.fn(),
}));

describe('useDashboard', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockNavigate = useNavigate as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
        mockNavigate.mockReturnValue(vi.fn());
    });

    it('should fetch dashboard data and update state on success', async () => {
        const mockResponse = { totalUsers: 10, totalOrders: 5 };
        (getDashboardData as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useDashboard());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getDashboardData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle API failure gracefully', async () => {
        (getDashboardData as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useDashboard());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getDashboardData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]); // Ensure data remains empty on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse = { totalUsers: 10, totalOrders: 5 };
        (getDashboardData as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useDashboard());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getDashboardData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
    });
});
