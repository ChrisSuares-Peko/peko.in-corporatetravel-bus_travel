import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { detailsApi } from '@src/domains/dashboard/works/api/detailsApi';
import { useDetailsApi } from '@src/domains/dashboard/works/hooks/useDetailsApi';
import { Works } from '@src/domains/dashboard/works/type/index';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/works/api/detailsApi', () => ({
    detailsApi: vi.fn(),
}));

describe('useDetailsApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockDetailsApi = detailsApi as any;

    beforeEach(() => {
        mockUseAppSelector.mockClear();
        mockDetailsApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockDetailsApi.mockResolvedValue(false); // Simulating failed API response

        const { result } = renderHook(() => useDetailsApi('work-1'));

        // Initial state check
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('should set data when API call is successful', async () => {
        const mockData: Works = {
            id: 1,
            name: 'Sample Work',
            features: 'Sample features',
            description: 'Sample description',
            image: 'sample.jpg',
            portfolioType: 'IMAGE',
            portfolio: ['portfolio1.jpg', 'portfolio2.jpg'],
            status: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            vendorId: 123,
            contactName: 'John Doe',
            contactEmail: 'john.doe@example.com',
            contactMobile: '555-1234',
        };

        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockDetailsApi.mockResolvedValue(mockData); // Simulate successful API response

        const { result } = renderHook(() => useDetailsApi('work-1'));

        // Wait for async operations to complete
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.data).toEqual(mockData);
    });

    it('should set isLoading to false when API call fails', async () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockDetailsApi.mockResolvedValue(false); // Simulate failed API response

        const { result } = renderHook(() => useDetailsApi('work-1'));

        // Wait for async operations to complete
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.data).toBeUndefined();
    });
});
