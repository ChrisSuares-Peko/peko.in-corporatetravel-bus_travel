import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import StepThree from '../../../components/sections/RegisterStepThree';
import useEmailVerify from '../../../hooks/useEmailVerify';
import useOtpApi from '../../../hooks/useOtpApi';
import { previousStep } from '../../../slices/registerSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));

vi.mock('../../../hooks/useEmailVerify', () => ({
    default: vi.fn(),
}));

vi.mock('../../../hooks/useOtpApi', () => ({
    default: vi.fn(),
}));

vi.useFakeTimers();

describe('StepThree Component', () => {
    const mockDispatch = vi.fn();
    const mockHandleVerifyOtp = vi.fn();
    const mockHandleOtp = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
        (useEmailVerify as any).mockReturnValue({
            handleVerifyOtp: mockHandleVerifyOtp,
            isError: false,
            isLoading: false,
        });
        (useOtpApi as any).mockReturnValue({
            handleOtp: mockHandleOtp,
        });
    });

    // afterEach(() => {
    //     vi.useRealTimers();
    // });

    it('renders all elements correctly', () => {
        render(<StepThree />);

        // Check for the presence of various elements
        expect(screen.getByText('Verify your email')).toBeInTheDocument();
        expect(
            screen.getByText('OTP has been sent to your registered email ID')
        ).toBeInTheDocument();
        expect(screen.getByText('Verify and Submit')).toBeInTheDocument();
        expect(screen.getByText(/Time Remaining:/)).toBeInTheDocument();
        expect(screen.getByText('Resend OTP')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('handles OTP input change', () => {
        render(<StepThree />);

        const otpInputs = screen.getAllByRole('textbox');
        fireEvent.change(otpInputs[0], { target: { value: '1' } });
        fireEvent.change(otpInputs[1], { target: { value: '2' } });
        fireEvent.change(otpInputs[2], { target: { value: '3' } });
        fireEvent.change(otpInputs[3], { target: { value: '4' } });
        fireEvent.change(otpInputs[4], { target: { value: '5' } });
        fireEvent.change(otpInputs[5], { target: { value: '6' } });

        expect(otpInputs[0]).toHaveValue('1');
        expect(otpInputs[1]).toHaveValue('2');
        expect(otpInputs[2]).toHaveValue('3');
        expect(otpInputs[3]).toHaveValue('4');
        expect(otpInputs[4]).toHaveValue('5');
        expect(otpInputs[5]).toHaveValue('6');
    });

    // it('disables resend OTP button initially and enables after timeout',async () => {
    //     render(<StepThree />);

    //     const resendButton = screen.getByText('Resend OTP');

    //     // Verify button is initially disabled
    //     expect(resendButton).toHaveStyle('color: GrayText');
    //     expect(resendButton).toHaveStyle('cursor: not-allowed');

    //     // Fast-forward the timer
    //     act(() => {
    //         vi.advanceTimersByTime(120000); // Fast-forward 2 minutes
    //     });

    //     waitFor(()=>{
    //         // Verify button is now enabled
    //         expect(screen.getByText('Resend OTP')).toHaveStyle('color: red');
    //         expect(screen.getByText('Resend OTP')).toHaveStyle('cursor: pointer');
    //     },{timeout:120000})
    // });

    it('calls handleVerifyOtp with the OTP when Verify and Submit button is clicked', () => {
        render(<StepThree />);

        const otpInputs = screen.getAllByRole('textbox');
        fireEvent.change(otpInputs[0], { target: { value: '1' } });
        fireEvent.change(otpInputs[1], { target: { value: '2' } });
        fireEvent.change(otpInputs[2], { target: { value: '3' } });
        fireEvent.change(otpInputs[3], { target: { value: '4' } });
        fireEvent.change(otpInputs[4], { target: { value: '5' } });
        fireEvent.change(otpInputs[5], { target: { value: '6' } });

        const verifyButton = screen.getByText('Verify and Submit');
        fireEvent.click(verifyButton);

        expect(mockHandleVerifyOtp).toHaveBeenCalledWith('123456');
    });

    it('dispatches previousStep action when Go Back is clicked', () => {
        render(<StepThree />);

        const goBackButton = screen.getByText('Go Back');
        fireEvent.click(goBackButton);

        expect(mockDispatch).toHaveBeenCalledWith(previousStep());
    });

    // it('calls handleResendOTP and updates state correctly', async () => {
    //     render(<StepThree />);

    //     const resendButton = screen.getByText('Resend OTP');

    //     // Verify button is initially disabled
    //     expect(resendButton).toHaveStyle('color: GrayText');
    //     expect(resendButton).toHaveStyle('cursor: not-allowed');

    //     // Fast-forward the timer
    //     act(() => {
    //         vi.advanceTimersByTime(120000); // Fast-forward 2 minutes
    //     });

    //     waitFor(()=>{
    //         // Verify button is now enabled
    //         expect(screen.getByText('Resend OTP')).toHaveStyle('color: red');
    //         expect(screen.getByText('Resend OTP')).toHaveStyle('cursor: pointer');
    //     },{timeout:120000})
    // });
});
