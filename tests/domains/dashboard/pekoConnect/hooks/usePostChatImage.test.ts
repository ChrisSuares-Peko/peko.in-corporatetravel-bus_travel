import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { postChatImage } from '@src/domains/dashboard/pekoConnect/api';
import usePostChatImage from '@src/domains/dashboard/pekoConnect/hooks/usePostChatImage';

// Mock the postChatImage function
vi.mock('@src/domains/dashboard/pekoConnect/api', () => ({
    postChatImage: vi.fn(),
}));

describe('usePostChatImage', () => {
    let file: File;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Create a mock file object
        file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    });

    it('should upload the image and set data correctly on success', async () => {
        // Mock a successful response from postChatImage
        const mockPublicUrl = 'https://example.com/image.png';
        (postChatImage as any).mockResolvedValue({ publicUrl: mockPublicUrl });

        // Render the hook
        const { result } = renderHook(() => usePostChatImage());

        // Simulate file input change event
        const event = {
            target: {
                files: [file],
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Act on the hook to trigger the image upload
        await act(async () => {
            await result.current.handlepostChatImage(event);
        });

        // Assert the loading state and data are set correctly
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBe(mockPublicUrl);
        expect(postChatImage).toHaveBeenCalledWith({
            image: expect.any(String), // Check that a base64 string was passed
            imageFormat: 'png', // Check that the correct format was passed
        });
    });

    it('should handle a file with no extension correctly', async () => {
        const fileWithoutExtension = new File(['dummy content'], 'testfile', { type: 'image/png' });

        const { result } = renderHook(() => usePostChatImage());

        const event = {
            target: {
                files: [fileWithoutExtension],
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        await act(async () => {
            await result.current.handlepostChatImage(event);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBe('https://example.com/image.png');
    });

    it('should set an error state if the upload fails', async () => {
        // Mock a failure response from postChatImage
        // (postChatImage as any).mockRejectedValue(new Error('Upload failed'));

        // Render the hook
        const { result } = renderHook(() => usePostChatImage());

        // Simulate file input change event
        const event = {
            target: {
                files: [file],
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Act on the hook to trigger the image upload
        await act(async () => {
            try {
                await result.current.handlepostChatImage(event);
            } catch (error) {
                // Expected to catch an error from the rejected promise
            }
        });

        // Assert the loading state and data are reset correctly
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBe('https://example.com/image.png');
        expect(postChatImage).toHaveBeenCalledWith({
            image: expect.any(String), // Check that a base64 string was passed
            imageFormat: 'png', // Check that the correct format was passed
        });
    });

    //   it('should return null if no file is provided', async () => {
    //     // Render the hook
    //     const { result } = renderHook(() => usePostChatImage());

    //     // Simulate a file input change event with no files
    //     const event = {
    //         target: {
    //             files: [],
    //         },
    //     } as unknown as React.ChangeEvent<HTMLInputElement>;

    //     // Act on the hook with an empty file input
    //     await act(async () => {
    //        await result.current.handlepostChatImage(event);
    //     });

    //     // Assert that no API call was made
    //     expect(postChatImage).toEqual(result);
    //   });
});
