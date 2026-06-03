import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
} from '@src/domains/dashboard/profile/api/address';
import useAddressesApi from '@src/domains/dashboard/profile/hooks/useAddressesApi';
import { setData } from '@src/domains/dashboard/profile/slices/address';
import {
    AddAddressRequestPayload,
    AddressListResponse,
    updateAddressRequestPayload,
    updateResponse,
} from '@src/domains/dashboard/profile/types/index';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/slices/address', () => ({
    setData: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/api/address', () => ({
    addAddress: vi.fn(),
    deleteAddress: vi.fn(),
    getAddresses: vi.fn(),
    updateAddress: vi.fn(),
}));

describe('useAddressesApi', () => {
    let dispatch: any;
    let handleCancel: any;

    beforeEach(() => {
        dispatch = vi.fn();
        handleCancel = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: 1,
            refresh: false,
            tableData: [],
            isLoading: false,
            isDeleteLoading: false,
        });
    });

    it('should fetch address list and update state', async () => {
        const mockResponse: AddressListResponse = {
            data: [
                {
                    id: 1,
                    name: 'John Doe',
                    nickname: 'Johnny',
                    department: 'HR',
                    city: 'New York',
                    country: 'USA',
                    addressLine1: '123 Main St',
                    addressLine2: '',
                    phoneNumber: '123-456-7890',
                    email: 'john.doe@example.com',
                    countryCode: 'US',
                    zipCode: '10001',
                    default: 1,
                    addressType: 'Home',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z',
                    credentialId: 1,
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    nickname: 'Janey',
                    department: 'IT',
                    city: 'San Francisco',
                    country: 'USA',
                    addressLine1: '456 Market St',
                    addressLine2: 'Apt 789',
                    phoneNumber: '987-654-3210',
                    email: 'jane.smith@example.com',
                    countryCode: 'US',
                    zipCode: '94105',
                    default: 0,
                    addressType: 'Work',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z',
                    credentialId: 2,
                },
            ],
        };
        (getAddresses as any).mockResolvedValue(mockResponse);

        renderHook(() => useAddressesApi({ handleCancel }));

        await act(async () => {
            await waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(
                    setData({
                        tableData: mockResponse.data.sort((a, b) => b.default - a.default),
                        isLoading: false,
                    })
                );
            });
        });
    });

    it('should handle adding an address', async () => {
        const mockResponse = { id: 1 };
        (addAddress as any).mockResolvedValue(mockResponse);

        const payload: AddAddressRequestPayload = {
            addressType: 'Home',
            addressLine1: '123 Main St',
            addressLine2: '',
            default: true,
            name: 'John Doe',
            phoneNumber: '123-456-7890',
            userType: 'user',
            credentialId: '1',
        };

        const { result } = renderHook(() => useAddressesApi({ handleCancel }));

        await act(async () => {
            await result.current.handleAddAddress(payload);
        });

        expect(dispatch).toHaveBeenCalledWith(setData({ refresh: true }));
        expect(showToast).toHaveBeenCalledWith({
            description: 'Address added successfully',
            variant: 'success',
        });
        expect(handleCancel).toHaveBeenCalled();
    });

    it('should handle deleting an address', async () => {
        (deleteAddress as any).mockResolvedValue(true);

        const { result } = renderHook(() => useAddressesApi({ handleCancel }));

        await act(async () => {
            await result.current.handleDeleteAddress(1);
        });

        expect(dispatch).toHaveBeenCalledWith(
            setData({ refresh: true, isDeleteLoading: false, id: 0 })
        );
        expect(showToast).toHaveBeenCalledWith({
            description: 'Address deleted successfully',
            variant: 'success',
        });
        expect(handleCancel).toHaveBeenCalled();
    });

    it('should handle updating an address', async () => {
        const mockResponse: updateResponse = { updatedAddress: [1] };
        (updateAddress as any).mockResolvedValue(mockResponse);

        const payload: updateAddressRequestPayload = {
            id: 1,
            addressType: 'Work',
            addressLine1: '456 Market St',
            addressLine2: 'Apt 789',
            default: false,
            name: 'Jane Smith',
            phoneNumber: '987-654-3210',
            userType: 'user',
            credentialId: '2',
        };

        const { result } = renderHook(() => useAddressesApi({ handleCancel }));

        await act(async () => {
            await result.current.handleUpdateAddress(payload);
        });

        expect(dispatch).toHaveBeenCalledWith(setData({ refresh: true, isLoading: false }));
        expect(showToast).toHaveBeenCalledWith({
            description: 'Address updated successfully',
            variant: 'success',
        });
        expect(handleCancel).toHaveBeenCalled();
    });
});
