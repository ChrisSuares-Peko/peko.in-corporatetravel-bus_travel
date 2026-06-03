import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { findCorporates } from '@domains/dashboard/Invoice/api';
import { useCorporates } from '@domains/dashboard/Invoice/hooks/useGetCorporates';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    findCorporates: vi.fn(),
}));

describe('useCorporates', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch corporate data and update state on success', async () => {
        const mockResponse: any = {
            corporateDetails: [
                { id: 1, name: 'Corporate 1', email: 'corporate1@example.com' },
                { id: 2, name: 'Corporate 2', email: 'corporate2@example.com' },
            ],
        };
        (findCorporates as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCorporates('Test Search'));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(findCorporates).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.corporateDetails);
    });

    it('should handle API failure gracefully', async () => {
        (findCorporates as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCorporates('Test Search'));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(findCorporates).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual([]); // Ensure data remains empty on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse: any = {
            corporateDetails: [
                { id: 1, name: 'Corporate 1', email: 'corporate1@example.com' },
                { id: 2, name: 'Corporate 2', email: 'corporate2@example.com' },
            ],
        };
        (findCorporates as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useCorporates('Test Search'));

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(findCorporates).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.corporateDetails);
    });

    it('should refresh data when refresh state is set to true', async () => {
        const mockResponse: any = {
            corporateDetails: [
                { id: 1, name: 'Corporate 1', email: 'corporate1@example.com' },
                { id: 2, name: 'Corporate 2', email: 'corporate2@example.com' },
            ],
        };
        (findCorporates as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCorporates('Test Search'));

        // Set refresh to true to trigger data refresh
        await act(async () => {
            result.current.setRefresh(true);
        });

        expect(findCorporates).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            searchText: 'Test Search',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.tableData).toEqual(mockResponse.corporateDetails);
    });
});
