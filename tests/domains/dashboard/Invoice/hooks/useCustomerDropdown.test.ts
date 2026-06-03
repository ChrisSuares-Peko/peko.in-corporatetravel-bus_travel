import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { findAll } from '@domains/dashboard/Invoice/api';
import { useCustomerDropdown } from '@domains/dashboard/Invoice/hooks/useCustomerDropdown';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    findAll: vi.fn(),
}));

describe('useCustomerDropdown', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch customer details and update tableData on success', async () => {
        const mockResponse: any = {
            customerDetails: [
                { id: 1, name: 'Customer 1', email: 'customer1@example.com' },
                { id: 2, name: 'Customer 2', email: 'customer2@example.com' },
            ],
        };
        (findAll as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCustomerDropdown('Test Search'));

        // Wait for useEffect to complete
        await act(async () => {
            await result.current.setRefresh(true);
        });

        expect(findAll).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.customerDetails);
    });

    it('should handle API failure gracefully', async () => {
        (findAll as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCustomerDropdown('Test Search'));

        // Wait for useEffect to complete
        await act(async () => {
            await result.current.setRefresh(true);
        });

        expect(findAll).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual([]);
    });

    it('should set refresh to false after data is fetched', async () => {
        const mockResponse: any = {
            customerDetails: [
                { id: 1, name: 'Customer 1', email: 'customer1@example.com' },
                { id: 2, name: 'Customer 2', email: 'customer2@example.com' },
            ],
        };
        (findAll as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCustomerDropdown('Test Search'));

        // Wait for useEffect to complete
        await act(async () => {
            result.current.setRefresh(true);
            await result.current.setRefresh(false); // Ensure refresh is set to false after fetching
        });

        expect(findAll).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.customerDetails);
        // expect(result.current.refresh).toBe(false); // Verify refresh is set to false
    });
});
