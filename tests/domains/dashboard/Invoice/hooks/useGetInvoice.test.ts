import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getAllInvoices } from '@domains/dashboard/Invoice/api';
import useGetInvoice from '@domains/dashboard/Invoice/hooks/useGetInvoice';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getAllInvoices: vi.fn(),
}));

describe('useGetInvoice', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should fetch invoice data and update state on success', async () => {
        const mockResponse: any = {
            recordsTotal: 2,
            invoices: [
                { id: 1, invoiceNumber: 'INV-001', amount: 100 },
                { id: 2, invoiceNumber: 'INV-002', amount: 200 },
            ],
        };
        (getAllInvoices as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetInvoice());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getAllInvoices).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            searchText: undefined,
            currentPage: 1,
            limit: 10,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });

    it('should handle API failure gracefully', async () => {
        (getAllInvoices as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useGetInvoice());

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getAllInvoices).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            searchText: undefined,
            currentPage: 1,
            limit: 10,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined(); // Ensure data remains undefined on failure
        expect(result.current.count).toBeUndefined(); // Ensure count remains undefined on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse: any = {
            recordsTotal: 2,
            invoices: [
                { id: 1, invoiceNumber: 'INV-001', amount: 100 },
                { id: 2, invoiceNumber: 'INV-002', amount: 200 },
            ],
        };
        (getAllInvoices as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useGetInvoice());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getAllInvoices).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            searchText: undefined,
            currentPage: 1,
            limit: 10,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });

    it('should update searchText and fetch data when setSearchText is called', async () => {
        const mockResponse: any = {
            recordsTotal: 1,
            invoices: [{ id: 1, invoiceNumber: 'INV-001', amount: 100 }],
        };
        (getAllInvoices as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetInvoice());

        // Update searchText and trigger data fetch
        await act(async () => {
            result.current.setSearchText('INV-001');
        });

        expect(result.current.searchText).toBe('INV-001');

        await act(async () => {
            await result.current.setSearchText('INV-001');
        });

        expect(getAllInvoices).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            searchText: 'INV-001',
            currentPage: 1,
            limit: 10,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });
});
