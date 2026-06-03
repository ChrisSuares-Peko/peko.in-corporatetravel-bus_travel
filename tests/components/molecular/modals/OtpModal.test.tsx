import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, beforeEach, vi, test, expect, afterEach } from 'vitest';

import OtpModal from '@components/molecular/modals/OtpModal';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('Otp Modal', () => {
    const mockDispatch = vi.fn();
    beforeEach(() => {
        vi.useFakeTimers(); // Enable fake timers
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        vi.clearAllTimers(); // Clear any timers after each test
        vi.useRealTimers(); // Restore real timers after each test
    });
    test('renders modal when isOpen is true', () => {
        render(
            <OtpModal
                isOpen
                handleCancel={() => {}}
                title="Enter OTP"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );
        expect(screen.getByText('Enter OTP')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 3')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 4')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 5')).toBeInTheDocument();
        expect(screen.getByLabelText('Please enter OTP character 6')).toBeInTheDocument();

        // Check time remaining
        expect(screen.getByText('Time Remaining 02:00')).toBeInTheDocument();

        // Check resend OTP button
        expect(screen.getByText('Resend OTP')).toBeInTheDocument();
    });

    test('does not render modal when isOpen is false', () => {
        render(
            <OtpModal
                isOpen={false}
                handleCancel={() => {}}
                title="Enter OTP"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );
        expect(screen.queryByText('Enter OTP')).toBeNull();
    });

    test('calls handleSubmit with OTP on Verify button click', () => {
        const handleSubmit = vi.fn();

        render(
            <OtpModal
                isOpen
                handleCancel={() => {}}
                title="Enter OTP"
                handleSubmit={handleSubmit}
                isLoading={false}
            />
        );

        expect(screen.getByText('Enter OTP')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Please enter OTP character 1'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 2'), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 3'), {
            target: { value: '3' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 4'), {
            target: { value: '4' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 5'), {
            target: { value: '5' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 6'), {
            target: { value: '6' },
        });

        fireEvent.click(screen.getByText('Verify'));

        // Verify handleSubmit was called with OTP
        expect(handleSubmit).toHaveBeenCalledWith('123456');
    });

    test('shows warning if OTP is invalid and Verify is clicked', () => {
        render(
            <OtpModal
                isOpen
                handleCancel={() => {}}
                title="Enter OTP"
                handleSubmit={() => {}}
                isLoading={false}
            />
        );

        fireEvent.change(screen.getByLabelText('Please enter OTP character 1'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 2'), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByLabelText('Please enter OTP character 3'), {
            target: { value: '3' },
        });
        fireEvent.click(screen.getByText('Verify'));

        expect(showToast).toHaveBeenCalledWith({
            description: 'Please enter a valid OTP',
            variant: 'warning',
        });
    });
    // test('calls onResend and disables resend button during countdown', async () => {
    //     const onResend = vi.fn();
    //     render(
    //         <OtpModal
    //             isOpen
    //             handleCancel={() => {}}
    //             title="Enter OTP"
    //             handleSubmit={() => {}}
    //             isLoading={false}
    //             onResend={onResend}
    //         />
    //     );
    //     act(() => {
    //         vi.advanceTimersByTime(120000); // Fast-forward by 120 seconds
    //     });

    //     const resendButton = screen.getByText('Resend OTP');
    //     fireEvent.click(resendButton);

    //     expect(onResend).toHaveBeenCalled();

    //     // Check if the button is no longer disabled
    //     await waitFor(() => {
    //         expect(resendButton).not.toHaveClass('cursor-not-allowed');
    //     });
    // });
});
