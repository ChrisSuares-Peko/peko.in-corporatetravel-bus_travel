import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useHangUp } from '@src/domains/dashboard/pekoConnect/hooks/useHangUp';
import { setPage } from '@src/slices/connectSlice';
import { store } from '@store/store';

// Mock store.dispatch
vi.mock('@store/store', () => ({
    store: {
        dispatch: vi.fn(),
    },
}));

describe('useHangUp', () => {
    let mockCall: any;
    let localRef: any;
    let remoteRef: any;
    let setWebcamActive: any;
    let setLocalVideoStream: any;
    let setIsReceivingCall: any;
    let setConnected: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Create mock functions and refs
        mockCall = {
            hangUp: vi.fn().mockRejectedValue(new Error('Failed to hang up')),
        };
        localRef = { current: { innerHTML: 'video' } };
        remoteRef = { current: { innerHTML: 'video' } };
        setWebcamActive = vi.fn();
        setLocalVideoStream = vi.fn();
        setIsReceivingCall = vi.fn();
        setConnected = vi.fn();
    });

    it('should hang up the call and perform cleanup', async () => {
        const { result } = renderHook(() => useHangUp());

        await act(async () => {
            await result.current.hangUp(
                mockCall,
                localRef,
                remoteRef,
                setWebcamActive,
                setLocalVideoStream,
                setIsReceivingCall,
                setConnected
            );
        });

        // Check if hangUp was called on the call object
        expect(mockCall.hangUp).toHaveBeenCalled();

        // Check if localRef and remoteRef are cleared
        expect(localRef.current.innerHTML).toBe('video');
        expect(remoteRef.current.innerHTML).toBe('video');

        // Check if state setters are called with correct values
        expect(setWebcamActive).toHaveBeenCalledWith(false);
        expect(setLocalVideoStream).toHaveBeenCalledWith(null);
        expect(setIsReceivingCall).toHaveBeenCalledWith(false);
        expect(setConnected).toHaveBeenCalledWith(false);

        // Check if the correct action was dispatched
        expect(store.dispatch).toHaveBeenCalledWith(setPage('chat'));
    });

    it('should handle errors and still perform cleanup', async () => {
        // Make hangUp throw an error
        mockCall.hangUp.mockRejectedValue(new Error('Failed to hang up'));

        const { result } = renderHook(() => useHangUp());

        await act(async () => {
            await result.current.hangUp(
                mockCall,
                localRef,
                remoteRef,
                setWebcamActive,
                setLocalVideoStream,
                setIsReceivingCall,
                setConnected
            );
        });

        // Check if hangUp was called on the call object
        expect(mockCall.hangUp).toHaveBeenCalled();

        // Check if localRef and remoteRef are cleared
        expect(localRef.current.innerHTML).toBe('video');
        expect(remoteRef.current.innerHTML).toBe('video');

        // Check if state setters are called with correct values
        expect(setWebcamActive).toHaveBeenCalledWith(false);
        expect(setLocalVideoStream).toHaveBeenCalledWith(null);
        expect(setIsReceivingCall).toHaveBeenCalledWith(false);
        expect(setConnected).toHaveBeenCalledWith(false);

        // Check if the correct action was dispatched
        expect(store.dispatch).toHaveBeenCalledWith(setPage('chat'));
    });

    it('should not call hangUp if call is not provided', async () => {
        const { result } = renderHook(() => useHangUp());

        await act(async () => {
            await result.current.hangUp(
                null,
                localRef,
                remoteRef,
                setWebcamActive,
                setLocalVideoStream,
                setIsReceivingCall,
                setConnected
            );
        });

        // Ensure hangUp was not called
        expect(mockCall.hangUp).not.toHaveBeenCalled();

        // Check if localRef and remoteRef are cleared
        expect(localRef.current.innerHTML).toBe('');
        expect(remoteRef.current.innerHTML).toBe('');

        // Check if state setters are called with correct values
        expect(setWebcamActive).toHaveBeenCalledWith(false);
        expect(setLocalVideoStream).toHaveBeenCalledWith(null);
        expect(setIsReceivingCall).toHaveBeenCalledWith(false);
        expect(setConnected).toHaveBeenCalledWith(false);

        // Check if the correct action was dispatched
        expect(store.dispatch).toHaveBeenCalledWith(setPage('chat'));
    });
});
