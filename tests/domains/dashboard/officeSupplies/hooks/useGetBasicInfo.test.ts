import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getBasicInfo } from '@domains/dashboard/officeSupplies/api/basicInfo';
import useBasicInfoApi from '@domains/dashboard/officeSupplies/hooks/useGetBasicInfo';
import { BasicInfoResponse } from '@domains/dashboard/profile/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/basicInfo', () => ({
    getBasicInfo: vi.fn(),
}));

describe('useBasicInfoApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch basic info and update the data state after success', async () => {
        const mockResponse: BasicInfoResponse = {
            name: 'John Doe',
            mobileNo: '123-456-7890',
            city: 'New York',
            designation: 'Software Engineer',
            email: 'john.doe@example.com',
            country: 'USA',
            contactPersonName: 'Jane Doe',
            companySize: 'Medium',
            landlineNo: '987-654-3210',
            mobileVerified: 1,
            logo: 'logo_url',
            package: {
                packageName: 'Premium',
            },
            credential: {
                username: 'johndoe',
            },
        };
        (getBasicInfo as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useBasicInfoApi());

        await waitFor(() => {
            expect(result.current.data).toEqual(mockResponse); // Wait for the data state to be updated
        });

        expect(getBasicInfo).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
    });

    it('should not update the data state if the API call fails', async () => {
        (getBasicInfo as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useBasicInfoApi());

        await waitFor(() => {
            expect(result.current.data).toBeUndefined(); // Ensure data state remains undefined on failure
        });

        expect(getBasicInfo).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
    });
});
