import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';

import StepThree from '../../../components/sections/RegisterStepFour';
import useOtpApi from '../../../hooks/useOtpApi';
import useRegistrationApi from '../../../hooks/useRegistrationApi';
import { previousStep } from '../../../slices/registerSlice';

// Mocking useDispatch
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));

// Mocking custom hooks
vi.mock('../../../hooks/useOtpApi', () => ({
    default: vi.fn(),
}));

vi.mock('../../../hooks/useRegistrationApi', () => ({
    default: vi.fn(),
}));

describe('StepThree Component', () => {
    let dispatchMock: typeof vi.fn;
    let handleSignupMock: typeof vi.fn;
    let handleMobileResendOtpMock: typeof vi.fn;
    let isLoadingMock: boolean;
    let isErrorMock: boolean;

    beforeEach(() => {
        dispatchMock = vi.fn();
        handleSignupMock = vi.fn();
        handleMobileResendOtpMock = vi.fn();
        isLoadingMock = false;
        isErrorMock = false;

        (useDispatch as any).mockReturnValue(dispatchMock);
        (useOtpApi as any).mockReturnValue({
            handleMobileResendOtp: handleMobileResendOtpMock,
            isLoading: isLoadingMock,
        });
        (useRegistrationApi as any).mockReturnValue({
            handleSignup: handleSignupMock,
            isError: isErrorMock,
            isLoading: isLoadingMock,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component correctly', () => {
        render(<StepThree />);

        expect(screen.getByText('Verify your Mobile Number')).toBeInTheDocument();
        expect(
            screen.getByText('OTP has been sent to your registered mobile number')
        ).toBeInTheDocument();
        expect(screen.getByText('Verify and Submit')).toBeInTheDocument();
        expect(screen.getByText('Time Remaining: 02:00')).toBeInTheDocument();
        expect(screen.getByText('Resend OTP')).toBeInTheDocument();
    });

    it('handles OTP input change correctly', () => {
        render(<StepThree />);

        const otpInputs = screen.getAllByRole('textbox');
        fireEvent.change(otpInputs[0], { target: { value: '1' } });

        expect(otpInputs[0]).toHaveValue('1');
    });

    it('calls handleSignup on clicking "Verify and Submit"', () => {
        render(<StepThree />);

        const verifyButton = screen.getByText('Verify and Submit');
        fireEvent.click(verifyButton);

        expect(handleSignupMock).toHaveBeenCalledWith('');
    });

    it('calls dispatch with previousStep when "Go Back" is clicked', () => {
        render(<StepThree />);

        const goBackText = screen.getByText('Go Back');
        fireEvent.click(goBackText);

        expect(dispatchMock).toHaveBeenCalledWith(previousStep(2));
    });
});
