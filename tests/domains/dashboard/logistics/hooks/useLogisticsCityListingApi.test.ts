import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { cityListing } from '@src/domains/dashboard/logistics/api';
import { useLogisticsCityListingApi } from '@src/domains/dashboard/logistics/hooks/useLogisticsCityLisitingApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    cityListing: vi.fn(),
}));

describe('useLogisticsCityListingApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockCityListing = cityListing as any;

    beforeEach(() => {
        // Mock the Redux state selector
        mockUseAppSelector.mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: '123',
                    },
                },
            })
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch city listing and update state on success', async () => {
        // Mock successful API response
        mockCityListing.mockResolvedValue({
            Cities: ['Dubai', 'Abu Dhabi'],
        });

        const { result } = renderHook(() => useLogisticsCityListingApi('Dubai', 'AE'));

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Wait for hook to execute and update state
        await act(async () => {
            // Trigger the API call
            result.current.setIsLoading(true);
        });

        // Assert final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([
            { oName: 'Dubai', oValue: 'Dubai' },
            { oName: 'Abu Dhabi', oValue: 'Abu Dhabi' },
        ]);
        expect(mockCityListing).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Dubai',
            countryCode: 'AE',
        });
    });

    it('should handle API error and set loading state correctly', async () => {
        // Mock API failure
        mockCityListing.mockResolvedValue(false);

        const { result } = renderHook(() => useLogisticsCityListingApi('Dubai', 'AE'));

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Wait for hook to execute and update state
        await act(async () => {
            // Trigger the API call
            result.current.setIsLoading(true);
        });

        // Assert final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([]);
    });

    it('should correctly reset city details state', async () => {
        // Mock successful API response
        mockCityListing.mockResolvedValue({
            Cities: ['Dubai'],
        });

        const { result, rerender } = renderHook(
            ({ searchText, countryCode }) => useLogisticsCityListingApi(searchText, countryCode),
            {
                initialProps: { searchText: 'Dubai', countryCode: 'AE' },
            }
        );

        // Wait for initial API call to complete
        await act(async () => {
            result.current.setIsLoading(false);
        });

        // Reset the city details
        act(() => {
            result.current.setCityDetails([]);
        });

        // Re-render without triggering useEffect by keeping the dependencies same
        rerender({ searchText: 'Dubai', countryCode: 'AE' });

        // Assert the state after reset
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([]);
    });
});
