import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getHikeOrderHistoryTable } from '../../api/orders';
import { useGetHikeHistoryApi } from '../../hooks/useGetHikeHistoryApi'; // Adjust import path as necessary

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('../../api/orders', () => ({
    getHikeOrderHistoryTable: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useGetHikeHistoryApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        (useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useGetHikeHistoryApi());

        expect(result.current.hikeHistoryData).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.page).toBe(1);
        expect(result.current.pageSize).toBe(5);
        expect(result.current.searchText).toBe('');
    });

    it('should fetch hike history data and set loading state', async () => {
        const mockResponse = {
            result: [
                {
                    order: {
                        orderResponse: JSON.stringify({
                            selectedHikes: [
                                {
                                    hikeName: 'Mountain Hike',
                                    quantity: 2,
                                    price: 100,
                                    totalPrice: 200,
                                    employees: [{ name: 'John Doe', employeeId: '1234' }],
                                },
                            ],
                        }),
                        transactionDate: '2023-10-01',
                        amountInAed: '200 AED',
                        status: 'Completed',
                    },
                },
            ],
            totalData: 1,
        };

        (getHikeOrderHistoryTable as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetHikeHistoryApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.hikeHistoryData).toEqual([
            {
                date: '2023-10-01',
                hikes: [
                    {
                        name: 'Mountain Hike',
                        quantity: 2,
                        price: 100,
                        totalPrice: 200,
                        employees: [{ name: 'John Doe', employeeId: '1234' }],
                    },
                ],
                totalAmount: '200 AED',
                status: 'Completed',
            },
        ]);
        expect(result.current.total).toBe(1);
    });

    it('should handle API failure and display error toast', async () => {
        (getHikeOrderHistoryTable as any).mockResolvedValueOnce(null);

        const { result } = renderHook(() => useGetHikeHistoryApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Something went wrong while fetching hike history',
                variant: 'error',
            })
        );
        expect(result.current.hikeHistoryData).toEqual([]);
        expect(result.current.total).toBe(0);
    });

    it('should update page number and fetch data again', async () => {
        const mockResponse = {
            result: [
                {
                    order: {
                        orderResponse: JSON.stringify({
                            selectedHikes: [
                                {
                                    hikeName: 'Mountain Hike',
                                    quantity: 1,
                                    price: 100,
                                    totalPrice: 100,
                                    employees: [{ name: 'John Doe', employeeId: '1234' }],
                                },
                            ],
                        }),
                        transactionDate: '2023-10-01',
                        amountInAed: '100 AED',
                        status: 'Completed',
                    },
                },
            ],
            totalData: 1,
        };

        (getHikeOrderHistoryTable as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetHikeHistoryApi());

        act(() => {
            result.current.setPage(2);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getHikeOrderHistoryTable).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            search: '',
            start: 2,
            length: 5,
        });
    });

    it('should update page size and fetch data again', async () => {
        const mockResponse = {
            result: [
                {
                    order: {
                        orderResponse: JSON.stringify({
                            selectedHikes: [
                                {
                                    hikeName: 'Mountain Hike',
                                    quantity: 1,
                                    price: 100,
                                    totalPrice: 100,
                                    employees: [{ name: 'John Doe', employeeId: '1234' }],
                                },
                            ],
                        }),
                        transactionDate: '2023-10-01',
                        amountInAed: '100 AED',
                        status: 'Completed',
                    },
                },
            ],
            totalData: 1,
        };

        (getHikeOrderHistoryTable as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetHikeHistoryApi());

        act(() => {
            result.current.setPageSize(10);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getHikeOrderHistoryTable).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            search: '',
            start: 1,
            length: 10,
        });
    });

    it('should update search text and fetch data again', async () => {
        const mockResponse = {
            result: [
                {
                    order: {
                        orderResponse: JSON.stringify({
                            selectedHikes: [
                                {
                                    hikeName: 'Desert Hike',
                                    quantity: 1,
                                    price: 100,
                                    totalPrice: 100,
                                    employees: [{ name: 'Jane Doe', employeeId: '5678' }],
                                },
                            ],
                        }),
                        transactionDate: '2023-10-05',
                        amountInAed: '100 AED',
                        status: 'Pending',
                    },
                },
            ],
            totalData: 1,
        };

        (getHikeOrderHistoryTable as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetHikeHistoryApi());

        act(() => {
            result.current.setSearchText('Desert');
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getHikeOrderHistoryTable).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            search: 'Desert',
            start: 1,
            length: 5,
        });

        expect(result.current.hikeHistoryData).toEqual([
            {
                date: '2023-10-05',
                hikes: [
                    {
                        name: 'Desert Hike',
                        quantity: 1,
                        price: 100,
                        totalPrice: 100,
                        employees: [{ name: 'Jane Doe', employeeId: '5678' }],
                    },
                ],
                totalAmount: '100 AED',
                status: 'Pending',
            },
        ]);
    });
});
