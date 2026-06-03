import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { getAnnouncementsAPI } from '@src/domains/dashboard/Payroll/api/announcementApi/index'; // Mock this
import GetAnnouncementsList from '@src/domains/dashboard/Payroll/hooks/announcementHooks/useAnnouncementListApi';
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

vi.mock('@src/domains/dashboard/Payroll/api/announcementApi/index', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        getAnnouncementsAPI: vi.fn(), // Correctly mock the API call
    };
});

vi.mock('@src/domains/dashboard/Payroll/utils/formatDateAndTime', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        formattedDate: vi.fn(date => `formatted-${date}`), // Mock the formatting function
    };
});

describe('GetAnnouncementsList hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch and format announcements data correctly', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call
        const mockResponse = {
            rows: [
                {
                    createdAt: '2023-08-12',
                    subject: 'Announcement 1',
                    status: 'MAILED',
                    excludedEmployees: [],
                    details: 'Details 1',
                    id: '1',
                },
                {
                    createdAt: '2023-08-13',
                    subject: 'Announcement 2',
                    status: 'MAILED',
                    excludedEmployees: [],
                    details: 'Details 2',
                    id: '2',
                },
            ],
            count: 2,
        };

        (getAnnouncementsAPI as Mock).mockResolvedValue(mockResponse);

        // Rendering the hook
        const { result } = renderHook(() => GetAnnouncementsList(1, 10, '', 2023, 8));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Triggering the async function with act
        await act(async () => {
            result.current.setRefresh(true);
        });

        // Asserting the correct API call is made
        expect(getAnnouncementsAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            page: 1,
            limit: 10,
            search: '',
            year: 2023,
            month: 8,
        });

        // Checking if the data is formatted correctly
        expect(result.current.announcementData).toEqual([
            {
                key: 1,
                date: 'formatted-2023-08-12',
                subject: 'Announcement 1',
                status: 'Mailed',
                excludedEmployees: [],
                details: 'Details 1',
                id: '1',
            },
            {
                key: 2,
                date: 'formatted-2023-08-13',
                subject: 'Announcement 2',
                status: 'Mailed',
                excludedEmployees: [],
                details: 'Details 2',
                id: '2',
            },
        ]);

        // Asserting count and loading state
        expect(result.current.count).toBe(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle case when no data is returned from API', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (no data)
        (getAnnouncementsAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => GetAnnouncementsList(1, 10, '', 2023, 8));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Triggering the async function with act
        await act(async () => {
            result.current.setRefresh(true);
        });

        // Asserting the correct API call is made
        expect(getAnnouncementsAPI).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
            page: 1,
            limit: 10,
            search: '',
            year: 2023,
            month: 8,
        });

        // Check that no data was set
        expect(result.current.announcementData).toBeUndefined();
        expect(result.current.count).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });
});
