import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { getDashboardDetails } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useDashboardApi } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useDashboardApi'; // The hook you created
import { useAppSelector } from '@src/hooks/store';
import '@testing-library/jest-dom/vitest';

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        useAppSelector: vi.fn(), // Mock useAppSelector
        useAppDispatch: vi.fn(), // Mock useAppDispatch if needed
    };
});

vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        getDashboardDetails: vi.fn(), // Mock the getDashboardDetails API call
    };
});

describe('useDashboardApi hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully fetch and set dashboard details', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = {
            upcomingActivities: [
                {
                    id: 'activity1',
                    title: 'Meeting 1',
                    date: '2023-09-25',
                },
                {
                    id: 'activity2',
                    title: 'Meeting 2',
                    date: '2023-09-26',
                },
                {
                    id: 'activity3',
                    title: 'Meeting 3',
                    date: '2023-09-27',
                },
            ],
        };
        (getDashboardDetails as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useDashboardApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Trigger the hook to fetch data
        await act(async () => {});

        // Asserting the correct API call is made
        expect(getDashboardDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        // Checking if the dashboard data is set correctly
        expect(result.current.data).toEqual(mockResponse);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set isLoading to false', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (failure)
        (getDashboardDetails as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useDashboardApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Trigger the hook to fetch data
        await act(async () => {});

        // Asserting the correct API call is made
        expect(getDashboardDetails).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
        });

        // Check that data is undefined and activities are empty when the API fails
        expect(result.current.data).toBeUndefined();
        expect(result.current.activities).toEqual([]);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });
});
