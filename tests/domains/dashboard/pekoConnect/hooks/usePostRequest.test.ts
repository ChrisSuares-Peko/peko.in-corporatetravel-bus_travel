import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { postRequest } from '@src/domains/dashboard/pekoConnect/api'; // Adjust the import path
import usePostRequest from '@src/domains/dashboard/pekoConnect/hooks/usePostRequest'; // Adjust the import path as necessary
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock the API function
vi.mock('@src/domains/dashboard/pekoConnect/api', () => ({
    postRequest: vi.fn(),
}));

// Mock the Redux hooks
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

describe('usePostRequest', () => {
    let mockDispatch: any;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Mock the dispatch function
        mockDispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('should set loading state and dispatch success toast on successful request', async () => {
        // Mock a successful response from postRequest
        (postRequest as any).mockResolvedValue({ success: true });

        // Render the hook
        const { result } = renderHook(() => usePostRequest());

        // Act on the hook to trigger the request
        await act(async () => {
            await result.current.handlePostRequest({ receiverId: '123', message: 'Hello!' });
        });

        // Assert loading state and dispatch call
        expect(result.current.isLoading).toBe(false);
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({ variant: 'success', description: 'Connection request has been sent.' })
        );
    });

    it('should handle error state correctly when request fails', async () => {
        // Mock a failure response from postRequest
        (postRequest as any).mockResolvedValue(null);

        // Render the hook
        const { result } = renderHook(() => usePostRequest());

        // Act on the hook to trigger the request
        await act(async () => {
            await result.current.handlePostRequest({ receiverId: '123', message: 'Hello!' });
        });

        // Assert loading state and ensure no dispatch call for success toast
        expect(result.current.isLoading).toBe(false);
        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({ variant: 'success', description: 'Connection request has been sent.' })
        );
    });
});
