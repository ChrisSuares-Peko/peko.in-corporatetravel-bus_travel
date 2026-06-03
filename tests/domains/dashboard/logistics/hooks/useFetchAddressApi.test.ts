import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { getSavedAddressApi } from '@src/domains/dashboard/logistics/api/address';
import { useFetchAddressApi } from '@src/domains/dashboard/logistics/hooks/useAddressApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api/address', () => ({
    getSavedAddressApi: vi.fn(),
}));

describe('useFetchAddressApi', () => {
    const mockAddressData = {
        addresses: [
            {
                id: '1',
                name: 'John Doe',
                country: 'CountryA',
                countryCode: 'A',
                city: 'CityA',
                addressLine1: 'Address Line 1',
                addressLine2: 'Address Line 2',
                zipCode: '12345',
                email: 'john.doe@example.com',
                phoneNumber: '1234567890',
            },
        ],
    };

    it('should set address options and loading state correctly when data is fetched successfully', async () => {
        // Arrange
        (useAppSelector as any).mockReturnValue({ role: 'user', id: 'user-id' });
        (getSavedAddressApi as any).mockResolvedValue(mockAddressData);

        // Act
        const { result } = renderHook(() => useFetchAddressApi(true));

        // Wait for the hook to update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.addressOptions).toEqual([
                {
                    label: 'John Doe',
                    value: JSON.stringify({
                        id: '1',
                        name: 'John Doe',
                        country: 'CountryA',
                        countryCode: 'A',
                        city: 'CityA',
                        address: 'Address Line 1,\nAddress Line 2',
                        zipCode: '12345',
                        email: 'john.doe@example.com',
                        phoneNumber: '1234567890',
                    }),
                },
            ]);
        });
    });

    it('should handle API errors and set loading state correctly', async () => {
        // Arrange
        (useAppSelector as any).mockReturnValue({ role: 'user', id: 'user-id' });
        (getSavedAddressApi as any).mockResolvedValue(false); // Simulate an API error

        // Act
        const { result } = renderHook(() => useFetchAddressApi(true));

        // Wait for the hook to update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.addressOptions).toEqual([]);
        });
    });

    it('should handle empty address data', async () => {
        // Arrange
        (useAppSelector as any).mockReturnValue({ role: 'user', id: 'user-id' });
        (getSavedAddressApi as any).mockResolvedValue({ addresses: [] });

        // Act
        const { result } = renderHook(() => useFetchAddressApi(true));

        // Wait for the hook to update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.addressOptions).toEqual([]);
        });
    });
});
