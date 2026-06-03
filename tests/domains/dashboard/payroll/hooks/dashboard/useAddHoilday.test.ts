import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { holiday } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useAddHoliday } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useAddHolidayApi'; // The hook you created
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
        holiday: vi.fn(), // Mock the holiday API call
    };
});

describe('useAddHoliday hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully add a holiday and return true', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = {
            success: true,
            event: {
                id: 'holiday123',
                title: 'Holiday Title',
                date: '2023-09-25',
            },
        };
        (holiday as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAddHoliday());

        const mockPayload = {
            title: 'Holiday Title',
            isAllDay: false,
            start: '2023-09-25T08:00:00',
            end: '2023-09-25T17:00:00',
            category: 'Public Holiday',
            sendPriorEmail: true,
            isEmailSent: false,
            userId: 98,
            userType: 'corporate',
        };

        let success;

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.addHoliday(mockPayload);
        });

        // Asserting the correct API call is made
        expect(holiday).toHaveBeenCalledWith({
            ...mockPayload,
            userId: '123',
            userType: 'admin',
        });

        // Asserting that the function returns true
        expect(success).toBe(true);
    });

    it('should return false when API call fails', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (failure)
        (holiday as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useAddHoliday());

        const mockPayload = {
            title: 'Holiday Title',
            isAllDay: false,
            start: '2023-09-25T08:00:00',
            end: '2023-09-25T17:00:00',
            category: 'Public Holiday',
            sendPriorEmail: true,
            isEmailSent: false,
            userType: 'corporate',
            userId: 321,
        };

        let success;

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.addHoliday(mockPayload);
        });

        // Asserting the correct API call is made
        expect(holiday).toHaveBeenCalledWith({
            ...mockPayload,
            userId: '456',
            userType: 'user',
        });

        // Asserting that the function returns false
        expect(success).toBe(false);
    });
});
