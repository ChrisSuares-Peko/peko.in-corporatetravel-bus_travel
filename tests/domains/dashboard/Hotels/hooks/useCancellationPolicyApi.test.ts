import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { cancellationPolicy } from '@domains/dashboard/Hotels/Api';
import useCancellationPolicyApi from '@domains/dashboard/Hotels/hooks/useCancellationPolicyApi';
import { getCancelPolicy } from '@domains/dashboard/Hotels/slices/getHotelSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/Api', () => ({
    cancellationPolicy: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/slices/getHotelSlice', () => ({
    getCancelPolicy: vi.fn(),
}));

describe('useCancellationPolicyApi', () => {
    const mockUseAppDispatch = useAppDispatch as any;
    const mockUseAppSelector = useAppSelector as any;
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockUseAppDispatch.mockReturnValue(mockDispatch);
    });

    it('should fetch cancellation policy successfully and dispatch the result', async () => {
        const mockResponse: any = {
            meta: {
                success: true,
                statusCode: 200,
                statusMessage: 'OK',
                actionType: 'fetch',
                conversationId: 'conversation123',
            },
            commonData: {
                searchKey: 'searchKey123',
                productCode: 'productCode123',
                culture: 'en-US',
            },
            data: [
                {
                    hotelKey: 'hotelKey123',
                    roomIndex: [1, 2],
                    roomKey: 'roomKey123',
                    description: 'Room with ocean view',
                    noShowPolicyDetail: {
                        noShowPolicyType: 'Fixed',
                        noShowPolicyCharge: 100,
                    },
                    isCombinePolicy: false,
                    cancellationDeadlineDate: '2024-12-31T23:59:59Z',
                    roomCombId: 'roomCombId123',
                },
            ],
            version: '1.0',
        };
        (cancellationPolicy as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCancellationPolicyApi());

        const data = await act(async () =>
            result.current.cancellationPolicyDetails(
                'conversation123',
                'hotelKey123',
                'searchKey123',
                [{ roomIndex: 1, roomKey: 'roomKey123' }], // Using the correct type `roomDatas`
                'en-US'
            )
        );

        expect(cancellationPolicy).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            hotelKey: 'hotelKey123',
            searchKey: 'searchKey123',
            conversationId: 'conversation123',
            rooms: [{ roomIndex: 1, roomKey: 'roomKey123' }],
            culture: 'en-US',
        });
        expect(mockDispatch).toHaveBeenCalledWith(getCancelPolicy(mockResponse));
        expect(data).toEqual(mockResponse.data);
        expect(result.current.isLoading).toBe(true);
    });

    it('should return an empty array when API call fails', async () => {
        (cancellationPolicy as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCancellationPolicyApi());

        const data = await act(async () =>
            result.current.cancellationPolicyDetails(
                'conversation123',
                'hotelKey123',
                'searchKey123',
                [{ roomIndex: 1, roomKey: 'roomKey123' }], // Using the correct type `roomDatas`
                'en-US'
            )
        );

        expect(cancellationPolicy).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            hotelKey: 'hotelKey123',
            searchKey: 'searchKey123',
            conversationId: 'conversation123',
            rooms: [{ roomIndex: 1, roomKey: 'roomKey123' }],
            culture: 'en-US',
        });
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });
});
