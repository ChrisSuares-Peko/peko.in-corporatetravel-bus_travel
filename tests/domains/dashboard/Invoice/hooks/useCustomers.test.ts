import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { addCustomer, deleteCustomer, getAllData } from '@domains/dashboard/Invoice/api';
import { useCustomers } from '@domains/dashboard/Invoice/hooks/useCustomers';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    addCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    getAllData: vi.fn(),
}));

describe('useCustomers', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch customer data and update tableData on success', async () => {
        const mockResponse = {
            rows: [
                { id: 1, name: 'Customer 1', email: 'customer1@example.com' },
                { id: 2, name: 'Customer 2', email: 'customer2@example.com' },
            ],
            recordsTotal: 2,
        };
        (getAllData as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() =>
            useCustomers({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        // Wait for useEffect to complete
        await act(async () => {
            await result.current.setRefresh(true);
        });

        expect(getAllData).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test',
            itemsPerPage: 10,
            page: 1,
            sort: 'asc',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.rows);
        expect(result.current.count).toBe(mockResponse.recordsTotal);
    });

    it('should handle API failure gracefully', async () => {
        (getAllData as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() =>
            useCustomers({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        // Wait for useEffect to complete
        await act(async () => {
            await result.current.setRefresh(true);
        });

        expect(getAllData).toHaveBeenCalledWith({
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

    it('should add a customer and refresh data', async () => {
        const mockAddResponse = { success: true };
        (addCustomer as any).mockResolvedValueOnce(mockAddResponse);

        const { result } = renderHook(() =>
            useCustomers({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        const mockPayload: any = { name: 'New Customer', email: 'newcustomer@example.com' };

        await act(async () => {
            await result.current.customerAdd(mockPayload);
        });

        expect(addCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            ...mockPayload,
        });

        expect(result.current.isLoading).toBe(false);
        // expect(result.current.refresh).toBe(true);
    });

    it('should delete a customer and show success toast', async () => {
        const mockDeleteResponse = { success: true };
        (deleteCustomer as any).mockResolvedValueOnce(mockDeleteResponse);

        const { result } = renderHook(() =>
            useCustomers({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        await act(async () => {
            const success = await result.current.customerDelete(1);
            expect(success).toBe(true);
        });

        expect(deleteCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            id: 1,
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Customer deleted successfully',
                variant: 'success',
            })
        );

        expect(result.current.isLoading).toBe(false);
        // expect(result.current.refresh).toBe(true);
    });

    it('should handle delete customer failure', async () => {
        (deleteCustomer as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() =>
            useCustomers({ searchText: 'Test', itemsPerPage: 10, page: 1, sort: 'asc' })
        );

        await act(async () => {
            const success = await result.current.customerDelete(1);
            expect(success).toBe(false);
        });

        expect(deleteCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            id: 1,
        });

        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({
                description: 'Customer deleted successfully',
                variant: 'success',
            })
        );

        expect(result.current.isLoading).toBe(false);
        // expect(result.current.refresh).toBe(false);
    });
});
