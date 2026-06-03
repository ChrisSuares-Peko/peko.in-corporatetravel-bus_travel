import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { getEmployeeCount } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import useGetEmployeeCount from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useGetEmployeeCount'; // The hook you created
import { useAppSelector } from '@src/hooks/store';
import '@testing-library/jest-dom/vitest';

// Mocking the external dependencies
vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        useAppSelector: vi.fn(), // Mock useAppSelector
    };
});

vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        getEmployeeCount: vi.fn(), // Mock the getEmployeeCount API call
    };
});

describe('useGetEmployeeCount hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch employee count and update state', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = { count: 5, lastEmployeeAddedDate: '2024-09-20' };
        (getEmployeeCount as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetEmployeeCount());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update state
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // isLoading should be false after API call
            expect(result.current.count).toBe(5); // count should be updated
            expect(result.current.date).toBe('2024-09-20'); // date should be updated
        });
    });

    it('should handle API failure and keep isLoading as false', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mock the API call to return false (failure)
        (getEmployeeCount as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useGetEmployeeCount());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update state after API failure
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // isLoading should be false after API failure
            expect(result.current.count).toBe(0); // count should remain 0
            expect(result.current.date).toBeUndefined(); // date should remain undefined
        });
    });

    it('should refresh data when setRefresh is triggered', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = { count: 10, lastEmployeeAddedDate: '2024-09-25' };
        (getEmployeeCount as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetEmployeeCount());

        // Wait for the hook to update state
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.count).toBe(10);
            expect(result.current.date).toBe('2024-09-25');
        });

        // Trigger refresh
        act(() => {
            result.current.setRefresh(true);
        });

        await waitFor(() => {
            expect(getEmployeeCount).toHaveBeenCalledTimes(2); // API should be called twice
        });
    });
});
