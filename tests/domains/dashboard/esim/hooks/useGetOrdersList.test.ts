import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getOrdersList } from '@domains/dashboard/esim/api/index'; // Ensure the path is correct
import useGetOrdersList from '@domains/dashboard/esim/hooks/useGetOrdersList'; // Ensure the path is correct
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@domains/dashboard/esim/api/index', () => ({
    getOrdersList: vi.fn(), // Ensure the mock function is correctly defined as a vi.fn()
}));

describe('useGetOrdersList', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch and set orders list successfully', async () => {
        const mockResponse = {
            data: [
                {
                    createdAt: '2024-09-12',
                    id: 'order123',
                    packageDetails: {
                        package: 'Package 1',
                        esim_type: 'eSIM',
                    },
                    transaction: {
                        order: {
                            amountInAed: 100,
                            paymentMode: 'CARD',
                        },
                    },
                    transactionId: 'txn123',
                    quantity: 1,
                    simDetails: [{ iccid: 'iccid123' }],
                },
            ],
            recordsTotal: 10,
        };

        (getOrdersList as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetOrdersList(10, 1, ''));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the API call to complete
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getOrdersList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            itemsPerPage: 10,
            page: 1,
            searchText: '',
        });

        // Check the API result is correctly set in the state
        expect(result.current.data).toEqual([
            {
                date: '2024-09-12',
                id: 'order123',
                plan: 'Package 1',
                esimType: 'eSIM',
                amount: 100,
                orderId: 'txn123',
                quantity: 1,
                iccid: ['iccid123'],
                paymentMethod: 'card',
            },
        ]);
        expect(result.current.totalRecord).toBe(10);
    });

    it('should handle API failure and set loading to false', async () => {
        // Mock API failure (return false)
        (getOrdersList as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useGetOrdersList(10, 1, ''));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the API call to complete
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getOrdersList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            itemsPerPage: 10,
            page: 1,
            searchText: '',
        });

        // Check that data is undefined when the API fails
        expect(result.current.data).toBeUndefined();
        expect(result.current.totalRecord).toBe(1); // As it is set to 1 initially
    });

    it('should set loading state correctly during the API call', async () => {
        const mockResponse = {
            data: [
                {
                    createdAt: '2024-09-12',
                    id: 'order123',
                    packageDetails: {
                        package: 'Package 1',
                        esim_type: 'eSIM',
                    },
                    transaction: {
                        order: {
                            amountInAed: 100,
                            paymentMode: 'CARD',
                        },
                    },
                    transactionId: 'txn123',
                    quantity: 1,
                    simDetails: [{ iccid: 'iccid123' }],
                },
            ],
            recordsTotal: 10,
        };

        // Mock a slow API call (resolve after a delay)
        (getOrdersList as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useGetOrdersList(10, 1, ''));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the API call to complete and loading state to change
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check that the data was set correctly after the API call
        expect(result.current.data).toEqual([
            {
                date: '2024-09-12',
                id: 'order123',
                plan: 'Package 1',
                esimType: 'eSIM',
                amount: 100,
                orderId: 'txn123',
                quantity: 1,
                iccid: ['iccid123'],
                paymentMethod: 'card',
            },
        ]);
    });
});
