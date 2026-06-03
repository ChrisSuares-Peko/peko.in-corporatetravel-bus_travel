import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

import {
    calendarActivities,
    upcomingActivities,
} from '@src/domains/dashboard/Payroll/api/dashBoardIndex';
import { useUpcomingActivityApi } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useUpcomingActivityApi';
import { useAppSelector } from '@src/hooks/store';

// Mock the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', () => ({
    upcomingActivities: vi.fn(),
    calendarActivities: vi.fn(),
}));

describe('useUpcomingActivityApi hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });
    });

    it('should fetch upcoming activities and calendar activities, and update state', async () => {
        const mockUpcomingData = {
            upcomingActivities: [
                { activityId: '1', name: 'Activity 1' },
                { activityId: '2', name: 'Activity 2' },
            ],
        };
        const mockCalendarData = {
            calendarActivities: [
                { eventId: '1', title: 'Event 1' },
                { eventId: '2', title: 'Event 2' },
            ],
        };

        // Mock API calls to return successful responses
        (upcomingActivities as Mock).mockResolvedValue(mockUpcomingData);
        (calendarActivities as Mock).mockResolvedValue(mockCalendarData);

        const { result } = renderHook(() => useUpcomingActivityApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update state after API calls
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual(mockUpcomingData.upcomingActivities); // Check upcoming activities
            expect(result.current.calendarData).toEqual(mockCalendarData.calendarActivities); // Check calendar activities
        });
    });

    it('should handle API failures and keep state unchanged', async () => {
        // Mock API calls to return false (failure)
        (upcomingActivities as Mock).mockResolvedValue(false);
        (calendarActivities as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useUpcomingActivityApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to finish
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([]); // Should return empty array if API fails
            expect(result.current.calendarData).toEqual([]); // Should return empty array if API fails
        });
    });
});
