import { renderHook, act, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';

import { getHotels } from '@domains/dashboard/Hotels/Api';
import useSearchApi from '@domains/dashboard/Hotels/hooks/useSearchApi';
import { searchList } from '@domains/dashboard/Hotels/types/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/Api', () => ({
    getHotels: vi.fn(),
}));

vi.mock('react-redux', () => ({
    useDispatch: vi.fn(() => vi.fn()),
}));

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ state: { key: 'search123' } })),
}));

describe('useSearchApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: { role: 'user', id: '123' },
                    hotels: {
                        hotelsRequest: {
                            country: 'USA',
                            city: 'New York',
                            checkIn: '2024-08-01',
                            checkOut: '2024-08-05',
                            rooms: [{ adult: 2, child: 0, roomIndex: 1 }],
                        },
                    },
                },
            })
        );
        vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        vi.useRealTimers(); // Restore real timers after each test
    });

    it('should fetch hotel data and update state on success', async () => {
        const mockResponse: searchList = {
            conversationId: 'conv123',
            meta: {
                success: true,
                statusCode: 200,
                statusMessage: 'OK',
                actionType: 'fetch',
                conversationId: 'conv123',
            },
            commonData: {
                searchKey: 'search123',
                culture: 'en-US',
            },
            data: [
                {
                    hotelKey: 'hotelKey1',
                    propertyInfo: {
                        hotelName: 'Hotel 1',
                        address: '123 Example St, New York, NY',
                        phoneNumber: '1234567890',
                        location: 'New York',
                        latitude: '40.7128',
                        longitude: '-74.0060',
                        imageUrl: '/hotel1.jpg',
                        facilities: ['Free Wi-Fi', 'Pool'],
                        propertyType: 'Hotel',
                        starRating: '5',
                    },
                    rooms: [],
                },
                {
                    hotelKey: 'hotelKey2',
                    propertyInfo: {
                        hotelName: 'Hotel 2',
                        address: '456 Example Ave, New York, NY',
                        phoneNumber: '0987654321',
                        location: 'New York',
                        latitude: '40.7128',
                        longitude: '-74.0060',
                        imageUrl: '/hotel2.jpg',
                        facilities: ['Free Breakfast', 'Gym'],
                        propertyType: 'Hotel',
                        starRating: '4',
                    },
                    rooms: [],
                },
            ],
        };

        (getHotels as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useSearchApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getHotels).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            country: 'USA',
            city: 'New York',
            checkIn: '2024-08-01',
            checkOut: '2024-08-05',
            rooms: [{ adult: 2, child: 0, roomIndex: 1 }],
        });

        expect(result.current.data).toEqual(mockResponse.data);
        expect(result.current.searchKey).toBe('search123');
        expect(result.current.conversationId).toBe('conv123');
    });

    it('should handle API failure and set state to empty values', async () => {
        (getHotels as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSearchApi());

        await act(async () => {
            await result.current.hotelsList();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getHotels).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            country: 'USA',
            city: 'New York',
            checkIn: '2024-08-01',
            checkOut: '2024-08-05',
            rooms: [{ adult: 2, child: 0, roomIndex: 1 }],
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.searchKey).toBe('');
        expect(result.current.conversationId).toBe('');
    });
});
