import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../../api/haflat';
import { useHafilatApi } from '../../../hooks/hafilat/useHafilatApi';
import { HaflatBalanceResponse } from '../../../types/haflat';

// Mock the necessary modules and functions
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../../api/haflat', () => ({
    getBalanceApi: vi.fn(),
}));

describe('useHafilatApi', () => {
    it('should return initial loading state and limitData as undefined', () => {
        (useAppSelector as Mock).mockReturnValue({ role: 'user', id: '123' });

        const { result } = renderHook(() => useHafilatApi());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.limitData).toBeUndefined();
    });

    it('should set limitData and return it after a successful API call', async () => {
        const mockResponse: HaflatBalanceResponse = {
            TransactionId: 'TXN123456',
            isHafilatCardValid: true,
            ExpiryDate: '2024-12-31',
            CardStatus: 'Active',
            RequestStatus: 'Success',
            ProductDetails: [
                {
                    ProductCode: 'PC123',
                    ProductTitle: 'Product Title 1',
                    TransactionType: 'Debit',
                    ProductCategory: 'Category A',
                    TitleNetwork: 'Network 1',
                    ValidityStartDate: '2024-01-01',
                    ValidityEndDate: '2024-12-31',
                    BalanceAmount: 500,
                    AmountInProcess: 50,
                    MaximumAllowed: 1000,
                    ItemInfo: null,
                },
            ],
            dueBalanceInAed: '150',
        };

        (useAppSelector as Mock).mockReturnValue({ role: 'user', id: '123' });
        (getBalanceApi as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useHafilatApi());

        await act(async () => {
            const data = await result.current.getBalance('TRAFFIC123', 'FLEXIKEY123');
            expect(data).toEqual(mockResponse);
        });

        expect(result.current.limitData).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(true); // Loading should remain true since the hook does not update it upon success
    });

    it('should return false and set isLoading to false when the API call fails', async () => {
        (useAppSelector as Mock).mockReturnValue({ role: 'user', id: '123' });
        (getBalanceApi as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useHafilatApi());

        await act(async () => {
            const data = await result.current.getBalance('TRAFFIC123', 'FLEXIKEY123');
            expect(data).toBe(false);
        });

        expect(result.current.limitData).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });
});
