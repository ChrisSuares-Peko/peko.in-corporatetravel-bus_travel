import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import GetSurcharge from '@src/domains/dashboard/logistics/hooks/useSurchargeApi'; // Import the hook
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';

vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useSurchargeApi', () => {
    beforeEach(() => {
        (useAppSelector as any).mockImplementation((callback: any) =>
            callback({
                reducer: {
                    auth: { role: 'admin', id: 1 },
                    logistics: { shippingAmount: { TotalAmount: '100' } },
                },
            })
        );
    });

    it('should fetch and set surcharge details correctly', async () => {
        (getSurcharge as any).mockResolvedValueOnce({
            surcharge: '10',
            corporateCashback: '5',
        });

        const { result } = renderHook(() => GetSurcharge());

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.surchargeData).toEqual({
                surcharge: '10',
                corporateCashback: '5',
            });
        });
    });

    it('should handle errors and set isLoading to false', async () => {
        (getSurcharge as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetSurcharge());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.surchargeData).toBeUndefined();
        });
    });

    // Optionally, you can test if the API is called with the correct parameters
    it('should call getSurcharge with correct parameters', async () => {
        (getSurcharge as any).mockResolvedValueOnce({
            surcharge: '10',
            corporateCashback: '5',
        });

        renderHook(() => GetSurcharge());

        await waitFor(() => {
            expect(getSurcharge).toHaveBeenCalledWith({
                userId: 1,
                userType: 'admin',
                amount: 100,
                accessKey: 'shipment_services',
            });
        });
    });
});
