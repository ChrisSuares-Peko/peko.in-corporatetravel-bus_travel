import { CallClient, LocalVideoStream } from '@azure/communication-calling';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useSetupSouces } from '@src/domains/dashboard/pekoConnect/hooks/useSetupSources';
// import { setPage } from '@src/slices/connectSlice';
// import { store } from '@store/store';

// Mock external dependencies
vi.mock('@azure/communication-calling', () => ({
    CallClient: vi.fn().mockImplementation(() => ({
        getDeviceManager: vi.fn().mockResolvedValue({
            askDevicePermission: vi.fn(),
            getCameras: vi.fn().mockResolvedValue([{}]), // Mocking one camera
        }),
    })),
    VideoStreamRenderer: vi.fn().mockImplementation(() => ({
        createView: vi.fn().mockResolvedValue({ target: document.createElement('div') }),
    })),
    LocalVideoStream: vi.fn(),
    RemoteVideoStream: vi.fn().mockImplementation(() => ({
        on: vi.fn(),
        isAvailable: true,
    })),
}));

vi.mock('@src/slices/connectSlice', () => ({
    setPage: vi.fn(),
}));

vi.mock('@store/store', () => ({
    store: {
        dispatch: vi.fn(),
    },
}));

describe('useSetupSouces', () => {
    const mockSetState = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize callClient and setup video sources correctly', async () => {
        const { result } = renderHook(() => useSetupSouces());
        const { setupSources } = result.current;

        const mockCallAgent = {
            startCall: vi
                .fn()
                .mockReturnValue({ on: vi.fn(), localVideoStreams: [], remoteParticipants: [] }),
        };
        const mockCall = {};
        const mockIncomingCall = {};

        await act(async () => {
            await setupSources(
                'create',
                'calleeAcsUserId',
                { current: document.createElement('video') },
                { current: document.createElement('video') },
                mockCallAgent,
                mockCall,
                mockIncomingCall,
                mockSetState,
                mockSetState,
                mockSetState,
                mockSetState,
                mockSetState,
                mockSetState,
                mockSetState,
                'video'
            );
        });

        expect(CallClient).toHaveBeenCalled();
        expect(mockCallAgent.startCall).toHaveBeenCalled();
        // expect(store.dispatch).toHaveBeenCalledWith(setPage('chat'));
        expect(mockSetState).toHaveBeenCalledWith(true);
    });

    //   it('should handle errors in setupSources', async () => {
    //     const { result } = renderHook(() => useSetupSouces());
    //     const { setupSources } = result.current;

    //     // Force an error
    //      // vi.spyOn(CallClient, '').mockRejectedValue(new Error('Device manager error'));

    //     await act(async () => {
    //       await setupSources(
    //         'create',
    //         'calleeAcsUserId',
    //         { current: document.createElement('video') },
    //         { current: document.createElement('video') },
    //         {},
    //         {},
    //         {},
    //         mockSetState,
    //         mockSetState,
    //         mockSetState,
    //         mockSetState,
    //         mockSetState,
    //         mockSetState,
    //         mockSetState,
    //         'video'
    //       );
    //     });

    //     expect(mockSetState).toHaveBeenCalledWith(false);
    //     expect(console.error).toHaveBeenCalledWith('Error in setupSources:', expect.any(Error));
    //   });

    it('should handle addVideoToCall', async () => {
        const { result } = renderHook(() => useSetupSouces());
        const { addVideoToCall } = result.current;

        const mockDeviceManager = {
            getCameras: vi.fn().mockResolvedValue([{}]), // Mocking one camera
        };

        const localVideoStream = await addVideoToCall(mockDeviceManager);

        expect(LocalVideoStream).toHaveBeenCalled();
        expect(localVideoStream).toBeInstanceOf(LocalVideoStream);
    });
});
