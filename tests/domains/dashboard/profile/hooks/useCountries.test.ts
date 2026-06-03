import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getCountries } from '@src/domains/dashboard/profile/api/general';
import useCountries from '@src/domains/dashboard/profile/hooks/useCountries';
import { CountriesResponse } from '@src/domains/dashboard/profile/types';

// Mock the API function
vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getCountries: vi.fn(),
}));

describe('useCountries', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        const { result } = renderHook(() => useCountries());
        expect(result.current.countriesList).toBeUndefined();
    });

    it('should fetch and set countries list', async () => {
        const mockCountriesResponse: CountriesResponse = {
            countries: [
                { value: 'us', label: 'United States' },
                { value: 'ca', label: 'Canada' },
            ],
        };
        (getCountries as any).mockResolvedValue(mockCountriesResponse);

        const { result } = renderHook(() => useCountries());

        await waitFor(() => {
            expect(getCountries).toHaveBeenCalled();
            expect(result.current.countriesList).toEqual(mockCountriesResponse.countries);
        });
    });

    it('should handle API failure', async () => {
        (getCountries as any).mockResolvedValue(false);

        const { result } = renderHook(() => useCountries());

        await waitFor(() => {
            expect(getCountries).toHaveBeenCalled();
            expect(result.current.countriesList).toBeUndefined();
        });
    });
});
