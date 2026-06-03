import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { chartDetails } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useChartDetailsApi } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useChartDetails'; // The hook you created
import { useAppSelector } from '@src/hooks/store';
import '@testing-library/jest-dom/vitest';

// Mocking the external dependencies
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
        chartDetails: vi.fn(), // Mock the chartDetails API call
    };
});

describe('useChartDetailsApi hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully fetch and set chart data', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = {
            chartData: [
                {
                    month: 'January',
                    value: 100,
                },
                {
                    month: 'February',
                    value: 200,
                },
            ],
        };
        (chartDetails as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useChartDetailsApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to fetch data
        await act(async () => {});

        // Asserting the correct API call is made
        expect(chartDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            year: '2024',
        });

        // Checking if the chart data is set correctly
        expect(result.current.data).toEqual([
            {
                month: 'January',
                value: 100,
            },
            {
                month: 'February',
                value: 200,
            },
        ]);

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
        (chartDetails as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useChartDetailsApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to fetch data
        await act(async () => {});

        // Asserting the correct API call is made
        expect(chartDetails).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
            year: '2024',
        });

        // Check that data is empty when the API fails
        expect(result.current.data).toEqual([]);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });

    it('should update year and fetch new data when handleYearChange is called', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = {
            chartData: [
                {
                    month: 'January',
                    value: 150,
                },
                {
                    month: 'February',
                    value: 250,
                },
            ],
        };
        (chartDetails as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useChartDetailsApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Call handleYearChange to trigger a year change and data refetch
        await act(async () => {
            result.current.handleYearChange('2025');
        });

        // Asserting the correct API call is made after year change
        expect(chartDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            year: '2025',
        });

        // Check that the new data is set correctly
        expect(result.current.data).toEqual([
            {
                month: 'January',
                value: 150,
            },
            {
                month: 'February',
                value: 250,
            },
        ]);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });
});
