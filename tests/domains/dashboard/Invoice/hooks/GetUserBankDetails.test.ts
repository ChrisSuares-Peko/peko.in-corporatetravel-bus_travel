import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getBankDetails } from '@domains/dashboard/Invoice/api';
import GetUserBankDetails from '@domains/dashboard/Invoice/hooks/useGetUserBankDetailsApi';
import { userBankDetailsResponse } from '@domains/dashboard/Invoice/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getBankDetails: vi.fn(),
}));

describe('GetUserBankDetails', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should fetch user bank details and update state on success', async () => {
        const mockResponse: userBankDetailsResponse = {
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            iban: 'IBAN123456',

            accountHolderName: 'John Doe',
            // ...other fields
        };
        (getBankDetails as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => GetUserBankDetails());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.bankDataLoader).toBe(false);
        expect(result.current.bankData).toEqual(mockResponse);
    });

    it('should handle API failure gracefully', async () => {
        (getBankDetails as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetUserBankDetails());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.bankDataLoader).toBe(false);
        expect(result.current.bankData).toBeUndefined(); // Ensure bankData remains undefined on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse: userBankDetailsResponse = {
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            iban: 'IBAN123456',

            accountHolderName: 'John Doe',
            // ...other fields
        };
        (getBankDetails as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => GetUserBankDetails());

        // Initially, bankDataLoader should be true
        expect(result.current.bankDataLoader).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getBankDetails).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        expect(result.current.bankDataLoader).toBe(false);
        expect(result.current.bankData).toEqual(mockResponse);
    });
});
