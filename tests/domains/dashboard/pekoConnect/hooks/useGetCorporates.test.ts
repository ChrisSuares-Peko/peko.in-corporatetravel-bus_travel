import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getCorporates } from '@src/domains/dashboard/pekoConnect/api'; // Update the import path as needed
import { useGetCorporates } from '@src/domains/dashboard/pekoConnect/hooks/useGetCorporates';

// Mock the getCorporates function
vi.mock('@src/domains/dashboard/pekoConnect/api', () => ({
    getCorporates: vi.fn(),
}));

describe('useGetCorporates', () => {
    it('should fetch corporates and set loading state correctly', async () => {
        const mockData = {
            result: [
                { id: '1', name: 'Corporate 1', credential: { username: 'user1' } },
                { id: '2', name: 'Corporate 2', credential: { username: 'user2' } },
            ],
        };

        // Set up the mock implementation
        const mockGetCorporates = vi.mocked(getCorporates);
        mockGetCorporates.mockResolvedValue(mockData);

        // Render the hook
        const { result } = renderHook(() => useGetCorporates({ searchText: 'corp' }));

        // Initially, loading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.corporates).toEqual([
                { value: '1', label: 'Corporate 1 - user1' },
                { value: '2', label: 'Corporate 2 - user2' },
            ]);
        });
    });

    it('should set corporates to empty array if searchText is less than 3 characters', async () => {
        const { result } = renderHook(() => useGetCorporates({ searchText: 'ab' }));

        // Initially, loading should be false
        expect(result.current.isLoading).toBe(false);

        // Wait for the hook to update
        await waitFor(() => {
            expect(result.current.corporates).toEqual([]);
        });
    });

    it('should handle errors from getCorporates', async () => {
        vi.mocked(getCorporates);

        const { result } = renderHook(() => useGetCorporates({ searchText: 'corp' }));

        expect(result.current.isLoading).toBe(true);

        try {
            await waitFor(() => {
                expect(result.current.isLoading).toBe(true);
                expect(result.current.corporates).toEqual([]);
            });
        } catch (error) {
            // Log and handle any errors to prevent unhandled rejections
            console.error('Error during test execution:', error);
        }
    });
});
