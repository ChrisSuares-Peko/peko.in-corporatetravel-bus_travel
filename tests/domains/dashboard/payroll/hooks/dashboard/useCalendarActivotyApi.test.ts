import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { calendarActivities } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useCalendarActivityApi } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useCalendarActivityApi'; // The hook you created
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
        calendarActivities: vi.fn(), // Mock the calendarActivities API call
    };
});

describe('useCalendarActivityApi hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully fetch and set calendar activities', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = {
            calendarActivities: [
                {
                    id: 'activity1',
                    title: 'Holiday 1',
                    date: '2023-09-25',
                    category: 'Public Holiday',
                },
                {
                    id: 'activity2',
                    title: 'Holiday 2',
                    date: '2023-09-26',
                    category: 'Festival',
                },
            ],
        };
        (calendarActivities as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useCalendarActivityApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Trigger the hook to fetch data
        await act(async () => {
            result.current.setRefresh(true);
        });

        // Asserting the correct API call is made
        expect(calendarActivities).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        // Checking if the calendar activities data is set correctly
        expect(result.current.holidays).toEqual([
            {
                id: 'activity1',
                title: 'Holiday 1',
                date: '2023-09-25',
                category: 'Public Holiday',
            },
            {
                id: 'activity2',
                title: 'Holiday 2',
                date: '2023-09-26',
                category: 'Festival',
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
        (calendarActivities as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useCalendarActivityApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Trigger the hook to fetch data
        await act(async () => {
            result.current.setRefresh(true);
        });

        // Asserting the correct API call is made
        expect(calendarActivities).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
        });

        // Check that holidays are empty when the API fails
        expect(result.current.holidays).toEqual([]);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });
});
