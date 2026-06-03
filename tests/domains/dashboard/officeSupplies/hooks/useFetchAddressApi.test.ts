import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getSavedAddressApi } from '@domains/dashboard/officeSupplies/api/address';
import { useFetchAddressApi } from '@domains/dashboard/officeSupplies/hooks/useFetchAddressApi';
import { SavedAddressResponse } from '@domains/dashboard/officeSupplies/types/address';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/address', () => ({
    getSavedAddressApi: vi.fn(),
}));

describe('useFetchAddressApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch address options and set loading to false after success', async () => {
        const mockResponse: SavedAddressResponse = {
            data: [
                {
                    name: 'Home',
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4B',
                    email: 'home@example.com',
                    phoneNumber: '123-456-7890',
                    id: 0,
                    nickname: '',
                    department: null,
                    city: null,
                    country: null,
                    countryCode: null,
                    zipCode: null,
                    isReceiver: 0,
                    default: 0,
                    credentialId: 0,
                },
                {
                    name: 'Work',
                    addressLine1: '456 Elm St',
                    addressLine2: '',
                    email: 'work@example.com',
                    phoneNumber: '',
                    id: 0,
                    nickname: '',
                    department: null,
                    city: null,
                    country: null,
                    countryCode: null,
                    zipCode: null,
                    isReceiver: 0,
                    default: 0,
                    credentialId: 0,
                },
            ],
        };
        (getSavedAddressApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useFetchAddressApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // Wait for loading to be false
        });

        expect(getSavedAddressApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(result.current.addressOptions).toEqual([
            {
                label: 'Home',
                value: JSON.stringify({
                    address: '123 Main St\nApt 4B',
                    email: 'home@example.com',
                    phoneNumber: '123-456-7890',
                }),
            },
            {
                label: 'Work',
                value: JSON.stringify({
                    address: '456 Elm St\n',
                    email: 'work@example.com',
                    phoneNumber: '',
                }),
            },
        ]);
    });

    it('should handle API failure and set loading to false', async () => {
        (getSavedAddressApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useFetchAddressApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // Wait for loading to be false
        });

        expect(getSavedAddressApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(result.current.addressOptions).toEqual([]); // Should remain an empty array on failure
    });
});
