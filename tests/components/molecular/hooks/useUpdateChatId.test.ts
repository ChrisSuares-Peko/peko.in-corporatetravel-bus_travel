import { renderHook, act } from '@testing-library/react';
import { vi, describe, beforeEach, test, expect, Mock } from 'vitest';

import { updateChatId } from '@components/molecular/freshChat/api/index';
import useUpdateChatId from '@components/molecular/freshChat/hooks/useUpdateChatId';

vi.mock('@components/molecular/freshChat/api/index', () => ({
    updateChatId: vi.fn(),
}));

describe('useUpdateChatId', () => {
    beforeEach(() => {
        (updateChatId as Mock).mockReset();
    });

    test('should have initial loading state as false', () => {
        const { result } = renderHook(() => useUpdateChatId());

        expect(result.current.isLoading).toBe(false);
    });

    test('should set isLoading to true when handleUpdateChatId is called', async () => {
        (updateChatId as Mock).mockResolvedValue(true);
        const { result } = renderHook(() => useUpdateChatId());

        act(() => {
            result.current.handleUpdateChatId({ restoreId: 'test-id' });
        });

        expect(result.current.isLoading).toBe(true);
    });

    test('should set isLoading to false after successful update', async () => {
        (updateChatId as Mock).mockResolvedValue(true);
        const { result } = renderHook(() => useUpdateChatId());

        await act(async () => {
            await result.current.handleUpdateChatId({ restoreId: 'test-id' });
        });

        expect(result.current.isLoading).toBe(false);
    });

    test('should set isLoading to false after failed update', async () => {
        (updateChatId as Mock).mockResolvedValue(false);
        const { result } = renderHook(() => useUpdateChatId());

        await act(async () => {
            await result.current.handleUpdateChatId({ restoreId: 'test-id' });
        });

        expect(result.current.isLoading).toBe(false);
    });

    test('should call updateChatId with correct payload', async () => {
        const mockPayload = { restoreId: 'test-id' };
        (updateChatId as Mock).mockResolvedValue(true);
        const { result } = renderHook(() => useUpdateChatId());

        await act(async () => {
            await result.current.handleUpdateChatId(mockPayload);
        });

        expect(updateChatId).toHaveBeenCalledWith(mockPayload);
    });

    test('should handle multiple calls correctly', async () => {
        (updateChatId as Mock).mockResolvedValue(true);
        const { result } = renderHook(() => useUpdateChatId());

        // First call
        act(() => {
            result.current.handleUpdateChatId({ restoreId: 'test-id-1' });
        });
        expect(result.current.isLoading).toBe(true);

        // Second call
        await act(async () => {
            await result.current.handleUpdateChatId({ restoreId: 'test-id-2' });
        });

        expect(result.current.isLoading).toBe(false);
    });
});
