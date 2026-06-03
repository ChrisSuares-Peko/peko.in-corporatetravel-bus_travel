import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { countryListing } from '@src/domains/dashboard/logistics/api';
import { useLogisticsCountryListingApi } from '@src/domains/dashboard/logistics/hooks/useLogisticsCountryListingApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    countryListing: vi.fn(),
}));

describe('useLogisticsCountryListingApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockCountryListing = countryListing as any;

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

    it('should fetch country listing and update state on success', async () => {
        // Mock successful API response
        mockCountryListing.mockResolvedValue({
            countries: [
                { name: 'United Arab Emirates', alpha2Code: 'AE' },
                { name: 'United States', alpha2Code: 'US' },
            ],
        });

        const { result } = renderHook(() => useLogisticsCountryListingApi('United'));

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Use waitFor to wait for the state update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Assert final state
        expect(result.current.data).toEqual([
            { oName: 'United Arab Emirates', oValue: 'AE' },
            { oName: 'United States', oValue: 'US' },
        ]);
        expect(mockCountryListing).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'United',
        });
    });

    it('should handle API error and set loading state correctly', async () => {
        // Mock API failure
        mockCountryListing.mockResolvedValue(false);

        const { result } = renderHook(() => useLogisticsCountryListingApi('United'));

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Use waitFor to wait for the state update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Assert final state
        expect(result.current.data).toEqual([]);
    });
});
