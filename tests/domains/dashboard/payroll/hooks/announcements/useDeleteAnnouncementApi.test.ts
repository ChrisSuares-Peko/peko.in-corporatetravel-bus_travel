import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { deleteAnnouncement } from '@src/domains/dashboard/Payroll/api/announcementApi/index';
import { useDeleteAnnouncementApi } from '@src/domains/dashboard/Payroll/hooks/announcementHooks/useDeleteAnnouncementApi';
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
        deleteAnnouncement: vi.fn(), // Mock the deleteAnnouncement API call
    };
});

describe('useDeleteAnnouncementApi hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should delete an announcement and call handleCancel on success', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call
        const mockResponse = {
            success: true,
        };
        (deleteAnnouncement as Mock).mockResolvedValue(mockResponse);

        const mockHandleCancel = vi.fn();

        const { result } = renderHook(() =>
            useDeleteAnnouncementApi({ handleCancel: mockHandleCancel })
        );

        let success;
        const mockAnnouncementId = 'announcement123';

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.deleteAnnouncementData(mockAnnouncementId);
        });

        // Asserting the correct API call is made
        expect(deleteAnnouncement).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            announcementId: mockAnnouncementId,
        });

        // Asserting that handleCancel was called
        expect(mockHandleCancel).toHaveBeenCalled();

        // Asserting that the deletion was successful
        expect(success).toBe(true);
    });

    it('should return false and not call handleCancel when deletion fails', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (failure)
        (deleteAnnouncement as Mock).mockResolvedValue(false);

        const mockHandleCancel = vi.fn();

        const { result } = renderHook(() =>
            useDeleteAnnouncementApi({ handleCancel: mockHandleCancel })
        );

        let success;
        const mockAnnouncementId = 'announcement456';

        // Trigger the async function with act
        await act(async () => {
            success = await result.current.deleteAnnouncementData(mockAnnouncementId);
        });

        // Asserting the correct API call is made
        expect(deleteAnnouncement).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
            announcementId: mockAnnouncementId,
        });

        // Asserting that handleCancel was not called
        expect(mockHandleCancel).not.toHaveBeenCalled();

        // Asserting that the deletion was not successful
        expect(success).toBe(false);
    });
});
