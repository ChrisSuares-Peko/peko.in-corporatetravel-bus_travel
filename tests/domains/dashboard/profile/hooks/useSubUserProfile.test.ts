import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

import { getSubCorporateBasicInfo } from '@src/domains/dashboard/profile/api/basicInfo';
import useSubCorporateInfoApi from '@src/domains/dashboard/profile/hooks/useSubUserProfile';
import { SubCorporateProfileResponse } from '@src/domains/dashboard/profile/types';

// Mock dependencies
vi.mock('@src/domains/dashboard/profile/api/basicInfo', () => ({
    getSubCorporateBasicInfo: vi.fn(),
}));

describe('useSubUserProfile', () => {
    const mockData: SubCorporateProfileResponse = {
        name: 'John Doe',
        mobileNo: '123-456-7890',
        email: 'john.doe@example.com',
        role: 'Manager',
        credential: {
            username: 'johndoe',
        },
    };

    beforeEach(() => {
        (getSubCorporateBasicInfo as any).mockResolvedValue(mockData);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should have correct initial state', () => {
        const { result } = renderHook(() => useSubCorporateInfoApi());

        expect(result.current.profileData).toBeNull();
        expect(result.current.isLoading).toBe(true);
    });

    it('should fetch and set profile data on mount', async () => {
        const { result } = renderHook(() => useSubCorporateInfoApi());

        // Assert that the initial state is loading
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update after fetching
        await waitFor(() => {
            expect(result.current.profileData).toEqual(mockData);
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should handle fetching error', async () => {
        (getSubCorporateBasicInfo as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSubCorporateInfoApi());

        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update after fetching
        await waitFor(() => {
            expect(result.current.profileData).toBeNull();
            expect(result.current.isLoading).toBe(false);
        });
    });
});
