import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { SurchargeResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

import GetSurcharge from '../../hooks/useSurchargeApi';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('@utils/accessKeys', () => ({
    accessKeys: {
        dubaiDED: 'mockedDubaiDEDKey',
    },
}));

describe('GetSurcharge', () => {
    const mockUser = {
        role: 'user',
        id: '1',
    };

    beforeEach(() => {
        (useAppSelector as Mock).mockReturnValue(mockUser);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch surcharge data and return it', async () => {
        const mockSurchargeResponse: SurchargeResponse = {
            surcharge: '10',
            corporateCashback: '50',
        };

        (getSurcharge as Mock).mockResolvedValue(mockSurchargeResponse);

        const { result } = renderHook(() => GetSurcharge(100));

        await waitFor(() => {
            expect(result.current.surchargeData).toEqual(mockSurchargeResponse);
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: mockUser.id,
            userType: mockUser.role,
            amount: 100,
            accessKey: accessKeys.dubaiDED,
        });
    });

    it('should handle no surcharge data returned', async () => {
        (getSurcharge as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => GetSurcharge(100));

        await waitFor(() => {
            expect(result.current.surchargeData).toBeUndefined();
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: mockUser.id,
            userType: mockUser.role,
            amount: 100,
            accessKey: accessKeys.dubaiDED,
        });
    });

    it('should handle changes to the amount parameter', async () => {
        const mockSurchargeResponse: SurchargeResponse = {
            surcharge: '15',
            corporateCashback: '30',
        };

        (getSurcharge as Mock).mockResolvedValue(mockSurchargeResponse);

        const { result, rerender } = renderHook(({ amount }) => GetSurcharge(amount), {
            initialProps: { amount: 100 },
        });

        rerender({ amount: 200 });

        await waitFor(() => {
            expect(result.current.surchargeData).toEqual(mockSurchargeResponse);
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: mockUser.id,
            userType: mockUser.role,
            amount: 200,
            accessKey: accessKeys.dubaiDED,
        });
    });
});
