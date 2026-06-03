import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { listingApi } from '@src/domains/dashboard/works/api/listingApi';
import { useListingApi } from '@src/domains/dashboard/works/hooks/useListingApi';
import { Works } from '@src/domains/dashboard/works/type/index';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/works/api/listingApi', () => ({
    listingApi: vi.fn(),
}));

vi.mock('react-redux', () => ({
    useDispatch: () => vi.fn(),
}));

describe('useListingApi Hook', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockListingApi = listingApi as any;

    beforeEach(() => {
        mockUseAppSelector.mockClear();
        mockListingApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockListingApi.mockResolvedValue({ data: { rows: [], count: 0 } }); // Mock API response

        const { result } = renderHook(() => useListingApi(1, 10));

        // Initial state check
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it('should set data and count when API call is successful', async () => {
        const mockData: Works[] = [
            {
                id: 1,
                name: 'Work 1',
                features: 'Feature 1',
                description: 'Description 1',
                image: 'image1.png',
                portfolioType: 'TEXT',
                portfolio: ['Portfolio 1'],
                status: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z',
                vendorId: 1,
                contactName: 'Contact 1',
                contactEmail: 'contact1@example.com',
                contactMobile: '555-1234',
            },
            // Add more mock works if needed
        ];
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockListingApi.mockResolvedValue({ data: { rows: mockData, count: mockData.length } }); // Simulate successful API response

        const { result } = renderHook(() => useListingApi(1, 10));

        // Await for the hook to finish its async work
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual(mockData);
            expect(result.current.count).toBe(mockData.length);
        });
    });

    it('should set isLoading to false when API call fails', async () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockListingApi.mockResolvedValue(false); // Simulate failed API response

        const { result } = renderHook(() => useListingApi(1, 10));

        // Await for the hook to finish its async work
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([]);
            expect(result.current.count).toBe(0);
        });
    });
});
