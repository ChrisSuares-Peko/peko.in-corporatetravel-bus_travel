import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { SurchargeResponse } from '@customtypes/general';
import GetSurcharge from '@domains/dashboard/officeSupplies/hooks/useSurchargeApi';
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));
vi.mock('@utils/accessKeys', () => ({
    accessKeys: {
        officeSupplies: 'OFFICE_SUPPLIES_ACCESS_KEY',
    },
}));

describe('GetSurcharge', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123', grandTotal: '100.00' });
    });

    it('should fetch surcharge details and update state on success', async () => {
        const mockResponse: SurchargeResponse = {
            surcharge: '10.00',
            corporateCashback: '10.00',
        };
        (getSurcharge as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => GetSurcharge());

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            amount: 100,
            accessKey: 'OFFICE_SUPPLIES_ACCESS_KEY',
        });

        expect(result.current.surchargeData).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set loading to false', async () => {
        (getSurcharge as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetSurcharge());

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            amount: 100,
            accessKey: 'OFFICE_SUPPLIES_ACCESS_KEY',
        });

        expect(result.current.surchargeData).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });
});
