import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getBankDetails, getUserDetails } from '@domains/dashboard/Invoice/api';
import GetUserDetails from '@domains/dashboard/Invoice/hooks/useGetUserDetailsApi';
import { userBankDetailsResponse, userDetailsResponse } from '@domains/dashboard/Invoice/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getBankDetails: vi.fn(),
    getUserDetails: vi.fn(),
}));

describe('GetUserDetails', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should fetch user and bank details and update state on success', async () => {
        const mockUserResponse: userDetailsResponse = {
            userName: 'John Doe', // Corrected to use `userName`
            userEmail: 'john.doe@example.com',
            mobileNo: 1234567890,
            addressId: 1,
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            userCountry: 'USA',
        };
        const mockBankResponse: userBankDetailsResponse = {
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            iban: 'IBAN123456',
            accountHolderName: 'John Doe',
        };
        (getUserDetails as any).mockResolvedValueOnce(mockUserResponse);
        (getBankDetails as any).mockResolvedValueOnce(mockBankResponse);

        const { result } = renderHook(() => GetUserDetails());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getUserDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.loader).toBe(false);
        expect(result.current.userData).toEqual(mockUserResponse);
        expect(result.current.bankData).toEqual(mockBankResponse);
    });

    it('should handle API failure gracefully', async () => {
        (getUserDetails as any).mockResolvedValueOnce(false);
        (getBankDetails as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetUserDetails());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getUserDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.loader).toBe(false);
        expect(result.current.userData).toBeUndefined(); // Ensure userData remains undefined on failure
        expect(result.current.bankData).toBeUndefined(); // Ensure bankData remains undefined on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockUserResponse: userDetailsResponse = {
            userName: 'John Doe', // Corrected to use `userName`
            userEmail: 'john.doe@example.com',
            mobileNo: 1234567890,
            addressId: 1,
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            userCountry: 'USA',
        };
        const mockBankResponse: userBankDetailsResponse = {
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            iban: 'IBAN123456',

            accountHolderName: 'John Doe',
            // ...other fields
        };
        (getUserDetails as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockUserResponse), 100))
        );
        (getBankDetails as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockBankResponse), 100))
        );

        const { result } = renderHook(() => GetUserDetails());

        // Initially, loader should be true
        expect(result.current.loader).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getUserDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.loader).toBe(true);
        expect(result.current.userData).toEqual(mockUserResponse);
    });
});
