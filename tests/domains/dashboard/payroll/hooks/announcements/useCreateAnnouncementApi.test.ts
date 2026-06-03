import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { createAnnouncementAPI } from '@src/domains/dashboard/Payroll/api/announcementApi/index'; // Mock this
import CreateAnnouncement from '@src/domains/dashboard/Payroll/hooks/announcementHooks/useCreateAnnoncementApi';
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
        createAnnouncementAPI: vi.fn(), // Correctly mock the API call
    };
});

describe('CreateAnnouncement hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create an announcement successfully', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call
        const mockResponse = {
            success: true,
            data: {
                excludedEmployees: [],
            },
        };

        (createAnnouncementAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => CreateAnnouncement());

        const mockPostData = {
            subject: 'New Announcement',
            details: 'Details about the announcement',
            excludedEmployees: [],
        };

        let success;

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.createAnnouncementHandler(mockPostData);
        });

        // Asserting the correct API call is made
        expect(createAnnouncementAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            postData: mockPostData,
        });

        // Asserting the API call was successful
        expect(success).toBe(true);
    });

    it('should return false when API call fails', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (failure)
        (createAnnouncementAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => CreateAnnouncement());

        const mockPostData = {
            subject: 'Another Announcement',
            details: 'Some details',
            excludedEmployees: [],
        };

        let success;

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.createAnnouncementHandler(mockPostData);
        });

        // Asserting the correct API call is made
        expect(createAnnouncementAPI).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
            postData: mockPostData,
        });

        // Asserting that the API call failed
        expect(success).toBe(false);
    });
});
