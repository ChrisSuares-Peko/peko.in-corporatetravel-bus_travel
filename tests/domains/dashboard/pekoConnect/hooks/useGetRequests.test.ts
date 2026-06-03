import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getRequests } from '@src/domains/dashboard/pekoConnect/api';
import { useGetRequests } from '@src/domains/dashboard/pekoConnect/hooks/useGetRequests';

// Mock the getRequests function
vi.mock('@src/domains/dashboard/pekoConnect/api', () => ({
    getRequests: vi.fn(),
}));

describe('useGetRequests', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear mocks before each test
    });

    it('should initialize with loading state', async () => {
        // Mock getRequests to not return any data
        (getRequests as any).mockResolvedValue([]);

        // Render the hook
        const { result } = renderHook(() => useGetRequests());

        // Wait for the hook to finish loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Verify initial loading state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.requests).toEqual([]);
    });

    it('should fetch and set requests correctly', async () => {
        // Mock data to be returned by getRequests
        const mockData = [
            { id: '1', status: 'PENDING' },
            { id: '2', status: 'COMPLETED' },
            { id: '3', status: 'PENDING' },
        ];

        // Mock getRequests to return the mock data
        (getRequests as any).mockResolvedValue(mockData);

        // Render the hook
        const { result } = renderHook(() => useGetRequests());

        // Wait for the hook to finish loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Verify that the hook sets the requests correctly
        expect(result.current.isLoading).toBe(false);
        expect(result.current.requests).toEqual([
            { id: '1', status: 'PENDING' },
            { id: '3', status: 'PENDING' },
        ]);
    });

    it('should handle empty data', async () => {
        // Mock getRequests to return an empty array
        (getRequests as any).mockResolvedValue([]);

        // Render the hook
        const { result } = renderHook(() => useGetRequests());

        // Wait for the hook to finish loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Verify that the hook handles empty data correctly
        expect(result.current.isLoading).toBe(false);
        expect(result.current.requests).toEqual([]);
    });

    it('should re-fetch data when refresh is called', async () => {
        // Initial mock data
        const initialData = [{ id: '1', status: 'PENDING' }];

        // Updated mock data
        const updatedData = [{ id: '2', status: 'PENDING' }];

        // Mock getRequests to return initial data
        (getRequests as any).mockResolvedValueOnce(initialData);

        // Render the hook
        const { result } = renderHook(() => useGetRequests());

        // Wait for the hook to finish loading with initial data
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.requests).toEqual(initialData);

        // Mock getRequests to return updated data on refresh
        (getRequests as any).mockResolvedValueOnce(updatedData);

        // Call refresh function
        await act(async () => {
            await result.current.refresh();
        });

        // Wait for the hook to finish loading with updated data
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Verify updated data
        expect(result.current.requests).toEqual(updatedData);
    });
});
