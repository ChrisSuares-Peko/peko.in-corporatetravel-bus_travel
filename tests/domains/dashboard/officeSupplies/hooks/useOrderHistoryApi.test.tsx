import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getTransactionsApi } from '@domains/dashboard/officeSupplies/api/orderHistory';
import { useOrderHistoryApi } from '@domains/dashboard/officeSupplies/hooks/useOrderHistoryApi';
import {
    TransactionsResponse,
    OrderTableItem,
} from '@domains/dashboard/officeSupplies/types/orderHistory';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/orderHistory', () => ({
    getTransactionsApi: vi.fn(),
}));

describe('useOrderHistoryApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch order history and set orders and count on success', async () => {
        const mockResponse: TransactionsResponse = {
            totalData: 2,
            result: [
                {
                    order: {
                        id: 1,
                        amountInAed: '100.00',
                        transactionDate: '2024-08-29T12:00:00Z',
                        corporateTxnId: 'TXN123',
                        paymentMode: 'Credit Card',
                        status: 'Completed',
                        orderResponse: JSON.stringify({
                            products: [{ productName: 'Product 1' }],
                        }),
                        ecomOrderStatus: 'Delivered',
                    },
                },
                {
                    order: {
                        id: 2,
                        amountInAed: '150.00',
                        transactionDate: '2024-08-30T12:00:00Z',
                        corporateTxnId: 'TXN124',
                        paymentMode: 'Debit Card',
                        status: 'Completed',
                        orderResponse: JSON.stringify({
                            products: [{ productName: 'Product 2' }],
                        }),
                        ecomOrderStatus: 'Delivered',
                    },
                },
            ],
        };
        (getTransactionsApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() =>
            useOrderHistoryApi({
                from: '2024-08-01',
                to: '2024-08-31',
                itemsPerPage: 10,
                page: 1,
                searchText: null,
                sort: 'ASC',
            })
        );

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getTransactionsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            from: '2024-08-01',
            to: '2024-08-31',
            itemsPerPage: 10,
            page: 1,
            searchText: null,
            sort: 'ASC',
        });

        const expectedOrders: OrderTableItem[] = [
            {
                id: 1,
                products: [{ productName: 'Product 1' }],
                amount: '100.00',
                date: '2024-08-29T12:00:00Z',
                status: 'Delivered',
                transactionId: 'TXN123',
            },
            {
                id: 2,
                products: [{ productName: 'Product 2' }],
                amount: '150.00',
                date: '2024-08-30T12:00:00Z',
                status: 'Delivered',
                transactionId: 'TXN124',
            },
        ];

        expect(result.current.orders).toEqual(expectedOrders);
        expect(result.current.count).toBe(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set loading to false', async () => {
        (getTransactionsApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() =>
            useOrderHistoryApi({
                from: '2024-08-01',
                to: '2024-08-31',
                itemsPerPage: 10,
                page: 1,
                searchText: null,
                sort: 'ASC',
            })
        );

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.count).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });
});
