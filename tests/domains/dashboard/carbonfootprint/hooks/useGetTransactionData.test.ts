import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getTransactions } from '@src/domains/dashboard/carbonFootprint/api';
import useGetTransactionData from '@src/domains/dashboard/carbonFootprint/hooks/useGetTransactionData';
import {
    transactionListingResponse,
    tableData,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

// Mock data
const mockTransactionData: tableData[] = [
    {
        date: '2024-08-01',
        transactionId: 'txn123',
        projectName: 'Project One',
        creditPurchased: '100',
        amount: 500,
        status: 'Completed',
    },
    // Add more transactions as needed
];

const mockTransactionResponse: transactionListingResponse = {
    success: true,
    data: mockTransactionData,
    count: mockTransactionData.length,
    totalPages: 1,
    usdToAed: 3.67,
};

// Mock the API call
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getTransactions: vi.fn(),
}));

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn().mockReturnValue({
        role: 'admin',
        id: 123,
    }),
}));

describe('useGetTransactionData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch transaction data and update states', async () => {
        (getTransactions as any).mockResolvedValue(mockTransactionResponse);

        const { result } = renderHook(() =>
            useGetTransactionData('searchQuery', 'ASC', 1, 10, 'filter', '2024-01-01', '2024-12-31')
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockTransactionData);
        expect(result.current.count).toBe(mockTransactionData.length);
    });

    it('should handle API failure gracefully', async () => {
        (getTransactions as any).mockResolvedValue(false);

        const { result } = renderHook(() =>
            useGetTransactionData('searchQuery', 'ASC', 1, 10, 'filter', '2024-01-01', '2024-12-31')
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBeUndefined();
    });
});
