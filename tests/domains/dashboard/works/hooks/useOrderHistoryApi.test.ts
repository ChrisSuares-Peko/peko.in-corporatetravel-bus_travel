import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getTransactionsApi } from '@src/domains/dashboard/works/api/orderHistory';
import { useOrderHistoryApi } from '@src/domains/dashboard/works/hooks/useOrderHistoryApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/domains/dashboard/works/api/orderHistory', () => ({
    getTransactionsApi: vi.fn(),
}));

describe('useOrderHistoryApi Hook', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockGetTransactionsApi = getTransactionsApi as any;

    beforeEach(() => {
        mockUseAppSelector.mockClear();
        mockGetTransactionsApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });

        const { result } = renderHook(() =>
            useOrderHistoryApi({
                from: '2024-01-01',
                to: '2024-01-31',
                itemsPerPage: 10,
                page: 1,
                searchText: '',
                sort: 'ASC',
            })
        );

        expect(result.current.isLoading).toBe(true);
    });

    it('should set orders and count and update loading state when API call is successful', async () => {
        const mockData = {
            totalData: 2,
            result: [
                {
                    order: {
                        id: 1,
                        amountInAed: '100',
                        paymentMode: 'Credit Card',
                        status: 'Completed',
                        orderResponse: JSON.stringify({
                            planDetails: {
                                name: 'Plan Name 1',
                                work: { name: 'Work Name 1' },
                            },
                        }),
                        ecomOrderStatus: 'Completed',
                        transactionDate: '2024-01-15',
                        corporateTxnId: 'TXN12345',
                        workspaceOrderStatus: 'Completed',
                    },
                },
                {
                    order: {
                        id: 2,
                        amountInAed: '200',
                        paymentMode: 'Debit Card',
                        status: 'Pending',
                        orderResponse: JSON.stringify({
                            planDetails: {
                                name: 'Plan Name 2',
                                work: { name: 'Work Name 2' },
                            },
                        }),
                        ecomOrderStatus: 'Pending',
                        transactionDate: '2024-01-20',
                        corporateTxnId: 'TXN67890',
                        workspaceOrderStatus: 'Pending',
                    },
                },
            ],
        };

        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockGetTransactionsApi.mockResolvedValue(mockData);

        const { result } = renderHook(() =>
            useOrderHistoryApi({
                from: '2024-01-01',
                to: '2024-01-31',
                itemsPerPage: 10,
                page: 1,
                searchText: '',
                sort: 'ASC',
            })
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.orders).toEqual([
            {
                id: 1,
                planName: 'Plan Name 1',
                workName: 'Work Name 1',
                amount: '100',
                date: '2024-01-15',
                status: 'Completed',
                transactionId: 'TXN12345',
            },
            {
                id: 2,
                planName: 'Plan Name 2',
                workName: 'Work Name 2',
                amount: '200',
                date: '2024-01-20',
                status: 'Pending',
                transactionId: 'TXN67890',
            },
        ]);
        expect(result.current.count).toBe(2);
    });

    it('should set isLoading to false when API call fails', async () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockGetTransactionsApi.mockResolvedValue(false); // Simulate API failure

        const { result } = renderHook(() =>
            useOrderHistoryApi({
                from: '2024-01-01',
                to: '2024-01-31',
                itemsPerPage: 10,
                page: 1,
                searchText: '',
                sort: 'ASC',
            })
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.orders).toEqual([]);
        expect(result.current.count).toBeUndefined();
    });
});
