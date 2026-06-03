import { renderHook, waitFor } from '@testing-library/react'; // Import necessary testing utilities
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getTransactionsApi } from '@src/domains/dashboard/logistics/api'; // Mocked API
import { useOrderHistoryApi } from '@src/domains/dashboard/logistics/hooks/useOrderHistoryApi'; // Hook to test
import { useAppSelector } from '@src/hooks/store'; // Mocked selector

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    getTransactionsApi: vi.fn(),
}));

describe('useOrderHistoryApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockGetTransactionsApi = getTransactionsApi as any;

    beforeEach(() => {
        // Mock the Redux state selector
        mockUseAppSelector.mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: '123',
                    },
                },
            })
        );
    });

    afterEach(() => {
        vi.clearAllMocks(); // Clear all mocks after each test
    });

    it('should fetch order history and update state on success', async () => {
        // Mock successful API response
        mockGetTransactionsApi.mockResolvedValue({
            totalData: 2,
            result: [
                {
                    order: {
                        id: 1,
                        orderResponse: JSON.stringify({
                            ProcessedPickup: {
                                ProcessedShipments: [{ ShipmentDetails: { ProductGroup: 'DOM' } }],
                            },
                        }),
                        amountInAed: '100.00',
                        transactionDate: '2024-09-13',
                        status: 'Completed',
                        corporateTxnId: 'TXN123',
                        providerId: 'PROV123',
                    },
                },
                {
                    order: {
                        id: 2,
                        orderResponse: JSON.stringify({
                            ProcessedPickup: {
                                ProcessedShipments: [{ ShipmentDetails: { ProductGroup: 'INTL' } }],
                            },
                        }),
                        amountInAed: '200.00',
                        transactionDate: '2024-09-14',
                        status: 'Pending',
                        corporateTxnId: 'TXN124',
                        providerId: 'PROV124',
                    },
                },
            ],
        });

        const { result } = renderHook(() =>
            (useOrderHistoryApi as any)({
                page: 1,
                itemsPerPage: 10,
                search: '',
                sort: 'asc',
            })
        );

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Use waitFor to wait for the state update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Assert final state
        expect(result.current.orders).toEqual([
            {
                key: 1,
                id: 1,
                shipmentType: 'Domestic',
                amount: '100.00',
                date: '2024-09-13',
                status: 'Completed',
                transactionId: 'TXN123',
                providerId: 'PROV123',
            },
            {
                key: 2,
                id: 2,
                shipmentType: 'International',
                amount: '200.00',
                date: '2024-09-14',
                status: 'Pending',
                transactionId: 'TXN124',
                providerId: 'PROV124',
            },
        ]);
        expect(result.current.count).toBe(2);
        expect(mockGetTransactionsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            sort: 'asc',
            page: 1,
            itemsPerPage: 10,
            search: '',
        });
    });

    it('should handle API error and set loading state correctly', async () => {
        // Mock API failure
        mockGetTransactionsApi.mockResolvedValue(false);

        const { result } = renderHook(() =>
            (useOrderHistoryApi as any)({
                page: 1,
                itemsPerPage: 10,
                search: '',
                sort: 'asc',
            })
        );

        // Assert initial loading state
        expect(result.current.isLoading).toBe(true);

        // Use waitFor to wait for the state update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Assert final state
        expect(result.current.orders).toEqual([]);
        expect(result.current.count).toBeUndefined();
    });
});
