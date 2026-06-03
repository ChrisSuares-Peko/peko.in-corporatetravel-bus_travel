import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { hotelAndRoomDetails } from '@domains/dashboard/Hotels/Api';
import useHotelDetailsApi from '@domains/dashboard/Hotels/hooks/useHotelDetailsApi';
import { getDetails } from '@domains/dashboard/Hotels/slices/getHotelSlice';
import { HotelSearch } from '@domains/dashboard/Hotels/types/hotelTypes';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/Api', () => ({
    hotelAndRoomDetails: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/slices/getHotelSlice', () => ({
    getDetails: vi.fn(),
}));

describe('useHotelDetailsApi', () => {
    const mockUseAppDispatch = useAppDispatch as any;
    const mockUseAppSelector = useAppSelector as any;
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockUseAppDispatch.mockReturnValue(mockDispatch);
    });

    it('should fetch hotel details and dispatch them successfully', async () => {
        const mockResponse: HotelSearch = {
            hotelDetails: {
                data: [
                    {
                        name: 'Test Hotel',
                        email: 'test@hotel.com',
                        phoneNumber: '1234567890',
                        images: [
                            {
                                path: '/test-image.jpg',
                                order: 0,
                                type: '',
                                description: '',
                            },
                        ],
                        address: 'Test Address',
                        rooms: undefined,
                        description: '',
                        starRating: '',
                        postalCode: '',
                        city: '',
                        country: '',
                        latitude: '',
                        longitude: '',
                        website: '',
                        location: '',
                        locationDesc: '',
                        map: '',
                        checkInTime: '',
                        checkOutTime: '',
                        childPolicy: '',
                        userRating: '',
                        hotelFacilities: [],
                        currency: '',
                    },
                ],
                meta: {
                    success: false,
                    statusCode: 0,
                    statusMessage: '',
                    actionType: '',
                    conversationId: '',
                },
                commonData: {
                    searchKey: '',
                    productCode: '',
                    culture: '',
                },
                version: '',
            },
            conversationId: '',
            moreRooms: {
                meta: {
                    success: false,
                    statusCode: 0,
                    statusMessage: '',
                    actionType: '',
                    conversationId: '',
                },
                commonData: {
                    searchKey: '',
                    culture: '',
                },
                data: [],
            },
        };
        (hotelAndRoomDetails as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useHotelDetailsApi());

        await act(async () => {
            await result.current.hotelDetails('hotelKey123', 'searchKey123', 'conversationId123');
        });

        expect(hotelAndRoomDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            hotelKey: 'hotelKey123',
            searchKey: 'searchKey123',
            conversationId: 'conversationId123',
        });
        expect(mockDispatch).toHaveBeenCalledWith(getDetails(mockResponse));
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set loading to false', async () => {
        (hotelAndRoomDetails as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useHotelDetailsApi());

        await act(async () => {
            await result.current.hotelDetails('hotelKey123', 'searchKey123', 'conversationId123');
        });

        expect(hotelAndRoomDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            hotelKey: 'hotelKey123',
            searchKey: 'searchKey123',
            conversationId: 'conversationId123',
        });
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during the API call', async () => {
        (hotelAndRoomDetails as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { result } = renderHook(() => useHotelDetailsApi());

        act(() => {
            result.current.hotelDetails('hotelKey123', 'searchKey123', 'conversationId123');
        });

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            // Wait for the mock API to resolve
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(result.current.isLoading).toBe(false);
    });
});
