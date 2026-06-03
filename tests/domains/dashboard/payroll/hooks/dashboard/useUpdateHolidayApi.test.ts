import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { holidayUpdate } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useUpdateHoliday } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useUpdateHolidayApi'; // The hook you created
import { holidayUpdatePayload } from '@src/domains/dashboard/Payroll/types/dashboardTypes';
import { useAppSelector } from '@src/hooks/store';

// Mocking the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', () => ({
    holidayUpdate: vi.fn(),
}));

describe('useUpdateHoliday hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call holidayUpdate and return true on success', async () => {
        // Mocking the API call to return a successful response
        const mockEventData = { eventId: '1', title: 'Holiday Event', start: '2024-09-20' };
        (holidayUpdate as Mock).mockResolvedValue(mockEventData);

        const { result } = renderHook(() => useUpdateHoliday());

        // Updated mockPayload to include the required fields
        const mockPayload: holidayUpdatePayload = {
            holidayId: '1',
            start: '2024-09-20',
            end: '2024-09-21',
            title: 'Updated Holiday',
            isAllDay: true, // Added field
            category: 'Public Holiday', // Added field
            sendPriorEmail: false, // Added field
        };

        // Trigger the updateHoliday function
        const success = await result.current.updateHoliday(mockPayload);

        // Check if the API was called with the correct arguments
        expect(holidayUpdate).toHaveBeenCalledWith({
            holidayId: '1',
            start: '2024-09-20',
            end: '2024-09-21',
            title: 'Updated Holiday',
            isAllDay: true,
            category: 'Public Holiday',
            sendPriorEmail: false,
            userId: '123',
            userType: 'admin',
        });

        // Expect the return value to be true since the API call was successful
        expect(success).toBe(true);
    });

    it('should return false when the API call fails', async () => {
        // Mocking the API call to return false (failure)
        (holidayUpdate as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useUpdateHoliday());

        // Updated mockPayload to include the required fields
        const mockPayload: holidayUpdatePayload = {
            holidayId: '1',
            start: '2024-09-20',
            end: '2024-09-21',
            title: 'Failed Update Holiday',
            isAllDay: true, // Added field
            category: 'Public Holiday', // Added field
            sendPriorEmail: true, // Added field
        };

        // Trigger the updateHoliday function
        const success = await result.current.updateHoliday(mockPayload);

        // Check if the API was called with the correct arguments
        expect(holidayUpdate).toHaveBeenCalledWith({
            holidayId: '1',
            start: '2024-09-20',
            end: '2024-09-21',
            title: 'Failed Update Holiday',
            isAllDay: true,
            category: 'Public Holiday',
            sendPriorEmail: true,
            userId: '123',
            userType: 'admin',
        });

        // Expect the return value to be false since the API call failed
        expect(success).toBe(false);
    });
});
