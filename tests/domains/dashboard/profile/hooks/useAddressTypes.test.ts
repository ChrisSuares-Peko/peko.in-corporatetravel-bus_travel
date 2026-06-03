// useAddressTypes.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getAddressTypes } from '@src/domains/dashboard/profile/api/general';
import useAddressTypes from '@src/domains/dashboard/profile/hooks/useAddressTypes';
import { AddressTypesResponse } from '@src/domains/dashboard/profile/types/index';

vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getAddressTypes: vi.fn(),
}));

describe('useAddressTypes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch address types and update state', async () => {
        const mockResponse: AddressTypesResponse = {
            addressType: [
                { label: 'Home', value: 'home' },
                { label: 'Work', value: 'work' },
            ],
        };

        (getAddressTypes as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAddressTypes());

        await waitFor(() => {
            expect(result.current.addressTypesList).toEqual(mockResponse.addressType);
        });

        expect(getAddressTypes).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch failure gracefully', async () => {
        (getAddressTypes as any).mockResolvedValue(false);

        const { result } = renderHook(() => useAddressTypes());

        await act(async () => {
            await waitFor(() => {
                expect(result.current.addressTypesList).toEqual([]);
            });
        });

        expect(getAddressTypes).toHaveBeenCalledTimes(1);
    });
});
