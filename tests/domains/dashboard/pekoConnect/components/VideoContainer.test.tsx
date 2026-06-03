import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import VideoContainer from '@src/domains/dashboard/pekoConnect/components/VideoContainer';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { setPage, setMode } from '@src/slices/connectSlice';

// Mock dependencies
vi.mock('@src/hooks/store');
vi.mock('@src/hooks/useScreenSize', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        md: vi.fn(),
    };
});

vi.mock('@src/slices/connectSlice', () => ({
    setPage: vi.fn(),
    setMode: vi.fn(),
}));

// Mock components
vi.mock('@src/domains/dashboard/pekoConnect/pages/Azure', () => ({
    Azure: vi.fn(),
}));

describe('VideoContainer', () => {
    const mockDispatch = vi.fn();
    const mockCallAgent = {
        on: vi.fn().mockImplementation((event, callback) => {
            if (event === 'incomingCall') {
                callback({ incomingCall: mockIncomingCall });
            }
        }),
        off: vi.fn(),
    };

    const mockIncomingCall = {
        id: 'mock-call-id',
        callerInfo: { displayName: 'John Doe' },
        reject: vi.fn(),
        on: vi.fn(),
    };

    beforeEach(() => {
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockReturnValue({ page: 'chat' });
        vi.clearAllMocks();
    });

    it('renders correctly when on the chat page', () => {
        render(<VideoContainer callAgent={mockCallAgent} />);

        expect(screen.queryByText('Incoming Call')).toBeInTheDocument();
    });

    it('handles incoming calls and displays the call UI', async () => {
        const { findByText } = render(<VideoContainer callAgent={mockCallAgent} />);

        // Mock incoming call event
        const incomingCallListener = mockCallAgent.on.mock.calls.find(
            call => call[0] === 'incomingCall'
        )?.[1] as (event: { incomingCall: typeof mockIncomingCall }) => void;

        if (incomingCallListener) {
            await act(async () => {
                incomingCallListener({ incomingCall: mockIncomingCall });
            });

            // Verify call UI shows up
            await expect(findByText('Incoming Call')).resolves.toBeInTheDocument();
            expect(screen.getByText('John doe')).toBeInTheDocument();
        }
    });

    it('plays and stops ringtone correctly', async () => {
        const { container } = render(<VideoContainer callAgent={mockCallAgent} />);

        // Mock incoming call event
        const incomingCallListener = mockCallAgent.on.mock.calls.find(
            call => call[0] === 'incomingCall'
        )?.[1] as (event: { incomingCall: typeof mockIncomingCall }) => void;

        if (incomingCallListener) {
            await act(async () => {
                incomingCallListener({ incomingCall: mockIncomingCall });
            });

            // Access the audio element directly
            const audioElement = container.querySelector('audio');

            if (audioElement) {
                // Check the audio source
                const audioSource = audioElement.querySelector('source');
                expect(audioSource?.getAttribute('src')).toBe('/src/assets/audio/callRingtone.wav');
                screen.debug();
                const rejectButton = container.querySelector('.ant-btn-primary.ant-btn-dangerous');
                if (!rejectButton) {
                    throw new Error('Reject button not found');
                }
                await act(async () => {
                    fireEvent.click(rejectButton);
                });
                // Verify the reject function was called
                expect(mockIncomingCall.reject).toHaveBeenCalled();

                // Check if audio element is removed
                await waitFor(() => {
                    const updatedAudioElement = container.querySelector('audio');
                    expect(updatedAudioElement).toBeNull();
                });
            } else {
                throw new Error('Audio element not found');
            }
        } else {
            throw new Error('Incoming call listener not found');
        }
    });

    it('accepts the call with correct type', async () => {
        const { container } = render(<VideoContainer callAgent={mockCallAgent} />);

        // Mock incoming call event
        const incomingCallListener = mockCallAgent.on.mock.calls.find(
            call => call[0] === 'incomingCall'
        )?.[1] as (event: { incomingCall: typeof mockIncomingCall }) => void;

        if (incomingCallListener) {
            await act(async () => {
                incomingCallListener({ incomingCall: mockIncomingCall });
            });
            const acceptButton = container.querySelector('.bg-vidoCallGreen');

            if (acceptButton) {
                await act(async () => {
                    fireEvent.click(acceptButton);
                });

                // Verify dispatch calls
                expect(mockDispatch).toHaveBeenCalledWith(setPage('video'));
                expect(mockDispatch).toHaveBeenCalledWith(setMode('join'));
            } else {
                throw new Error('Accept button not found');
            }
        } else {
            throw new Error('Incoming call listener not found');
        }
    });

    it('cleans up event listeners on unmount', () => {
        const { unmount } = render(<VideoContainer callAgent={mockCallAgent} />);
        unmount();
        expect(mockCallAgent.off).toHaveBeenCalled();
    });
});
