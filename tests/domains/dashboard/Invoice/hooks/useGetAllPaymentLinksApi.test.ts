import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getAllPaymentLinks } from '@domains/dashboard/Invoice/api';
import { useAllpaymentLinks } from '@domains/dashboard/Invoice/hooks/useGetAllPaymentLinksApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getAllPaymentLinks: vi.fn(),
}));

describe('useAllpaymentLinks', () => {
    const mockDispatch = useDispatch as any;
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch payment links data and update state on success', async () => {
        const mockResponse = {
            data: [
                { id: 1, name: 'Payment Link 1', amount: 100 },
                { id: 2, name: 'Payment Link 2', amount: 200 },
            ],
            recordsTotal: 2,
        };
        (getAllPaymentLinks as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() =>
            useAllpaymentLinks({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getAllPaymentLinks).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test',
            itemsPerPage: 10,
            page: 1,
            sort: 'asc',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.data);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });

    it('should handle API failure gracefully', async () => {
        (getAllPaymentLinks as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() =>
            useAllpaymentLinks({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getAllPaymentLinks).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test',
            itemsPerPage: 10,
            page: 1,
            sort: 'asc',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual([]);
        expect(result.current.count).toBe(1);
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse = {
            data: [
                { id: 1, name: 'Payment Link 1', amount: 100 },
                { id: 2, name: 'Payment Link 2', amount: 200 },
            ],
            recordsTotal: 2,
        };
        (getAllPaymentLinks as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() =>
            useAllpaymentLinks({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getAllPaymentLinks).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test',
            itemsPerPage: 10,
            page: 1,
            sort: 'asc',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.data);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });
});
