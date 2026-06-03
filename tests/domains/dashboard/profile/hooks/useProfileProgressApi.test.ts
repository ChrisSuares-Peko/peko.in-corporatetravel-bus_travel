import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { progress } from '@src/domains/dashboard/profile/api/basicInfo';
import { useProfileProgressApi } from '@src/domains/dashboard/profile/hooks/useProfileProgressApi';
import { progressResponse } from '@src/domains/dashboard/profile/types';
import { useAppSelector } from '@src/hooks/store';

// Mock the dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/api/basicInfo', () => ({
    progress: vi.fn() as any,
}));

describe('useProfileProgressApi', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('should have correct initial state', () => {
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
            addressRefresh: 0,
            bankRefresh: 0,
            basicInfoRefresh: 0,
            companyInfoRefresh: 0,
        });

        const { result } = renderHook(() => useProfileProgressApi());

        expect(result.current.progressLoader).toBe(true);
        expect(result.current.progressData).toBeUndefined();
    });

    it('should fetch and set profile progress data', async () => {
        const mockData: progressResponse = {
            addressDetailsProgress: 50,
            progress: 'In Progress',
            bankDetailsProgress: 70,
            basicInfoProgress: 80,
            companyInfoProgress: 90,
            strength: 'Good',
            tips: 'Complete all sections',
            referralLink: 'http://example.com/referral',
        };

        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
            addressRefresh: 1,
            bankRefresh: 1,
            basicInfoRefresh: 1,
            companyInfoRefresh: 1,
        });

        (progress as any).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProfileProgressApi());

        await waitFor(() => expect(result.current.progressLoader).toBe(false)); // Wait for loading to be false
        expect(result.current.progressData).toEqual(mockData);
    });

    it('should handle empty or error response gracefully', async () => {
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
            addressRefresh: 1,
            bankRefresh: 1,
            basicInfoRefresh: 1,
            companyInfoRefresh: 1,
        });

        (progress as any).mockResolvedValue(false);

        const { result } = renderHook(() => useProfileProgressApi());

        await waitFor(() => expect(result.current.progressLoader).toBe(false));
        expect(result.current.progressData).toBeUndefined();
    });

    it('should refetch data when dependencies change', async () => {
        const mockData: progressResponse = {
            addressDetailsProgress: 50,
            bankDetailsProgress: 70,
            basicInfoProgress: 80,
            companyInfoProgress: 90,
            progress: 'In Progress',
            strength: 'Good',
            tips: 'Complete all sections',
            referralLink: 'http://example.com/referral',
        };

        // Initial state with dependencies
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
            addressRefresh: 1,
            bankRefresh: 1,
            basicInfoRefresh: 1,
            companyInfoRefresh: 1,
        });

        // Mock resolved data
        (progress as any).mockResolvedValue(mockData);

        const { result, rerender } = renderHook(() => useProfileProgressApi());

        // Initial fetch
        await waitFor(() => expect(result.current.progressData).toBeUndefined());

        // Simulate dependency change
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
            addressRefresh: 2,
            bankRefresh: 2,
            basicInfoRefresh: 2,
            companyInfoRefresh: 2,
        });

        // Trigger refetch
        rerender();

        await waitFor(() => {
            // console.log('Current progressData:', result.current.progressData);
            expect(result.current.progressData).toEqual(mockData);
        });
    });
});
