import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { putRequest } from '@src/domains/dashboard/pekoConnect/api'; // Adjust the import path
import usePutRequest from '@src/domains/dashboard/pekoConnect/hooks/usePutRequest'; // Adjust the import path as necessary
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { setPendingRequests } from '@src/slices/connectSlice';

// Mock the API function
vi.mock('@src/domains/dashboard/pekoConnect/api', () => ({
    putRequest: vi.fn(),
}));

// Mock the Redux hooks
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

describe('usePutRequest', () => {
    let mockDispatch: any;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Mock the dispatch function
        mockDispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('should set loading state and dispatch actions on successful request', async () => {
        // Mock a successful response from putRequest
        const mockResponse = { pendingRequests: 3 };
        (putRequest as any).mockResolvedValue(mockResponse);

        // Render the hook
        const { result } = renderHook(() => usePutRequest());

        // Act on the hook to trigger the request
        await act(async () => {
            await result.current.handlePutRequest({ requestId: '123', status: 'ACCEPTED' });
        });

        // Assert loading state and dispatch calls
        expect(result.current.isLoading).toBe(false);
        expect(mockDispatch).toHaveBeenCalledWith(setPendingRequests(3));
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                variant: 'success',
                description: 'Request Accepted',
            })
        );
    });

    it('should handle error state correctly when request fails', async () => {
        // Mock a failure response from putRequest
        (putRequest as any).mockResolvedValue(null);

        // Render the hook
        const { result } = renderHook(() => usePutRequest());

        // Act on the hook to trigger the request
        await act(async () => {
            await result.current.handlePutRequest({ requestId: '123', status: 'REJECTED' });
        });

        // Assert loading state and ensure correct behavior when API fails
        expect(result.current.isLoading).toBe(false);
        expect(mockDispatch).not.toHaveBeenCalledWith(setPendingRequests(expect.anything()));
        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({
                variant: 'success',
                description: 'Request Rejected',
            })
        );
    });
});
