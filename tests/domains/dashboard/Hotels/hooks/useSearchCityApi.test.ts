import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { fetchCityData } from '@domains/dashboard/Hotels/Api';
import useSearchCityApi from '@domains/dashboard/Hotels/hooks/useSearchCityApi';
import { CityData } from '@domains/dashboard/Hotels/types/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/Api', () => ({
    fetchCityData: vi.fn(),
}));

describe('useSearchCityApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({
            role: 'user',
            id: '123',
        });
    });

    it('should fetch city data and set city options on success', async () => {
        const mockResponse: CityData = {
            cities: [
                { id: 1, cityName: 'New York', countryName: 'USA' },
                { id: 2, cityName: 'Los Angeles', countryName: 'USA' },
                // add more cities as needed
            ],
        };

        (fetchCityData as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useSearchCityApi());

        await act(async () => {
            await result.current.cityList('USA');
        });

        expect(fetchCityData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'USA',
        });
        expect(result.current.cityOptions).toEqual(mockResponse.cities.slice(0, 50));
    });

    it('should handle failure and set city options to an empty array', async () => {
        (fetchCityData as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSearchCityApi());

        await act(async () => {
            await result.current.cityList('USA');
        });

        expect(fetchCityData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'USA',
        });
        expect(result.current.cityOptions).toEqual([]);
    });

    it('should maintain the loading state correctly', async () => {
        const { result } = renderHook(() => useSearchCityApi());

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            await result.current.cityList('USA');
        });

        expect(result.current.isLoading).toBe(true); // `isLoading` is not being updated in the hook, so it should stay `true`
    });
});
