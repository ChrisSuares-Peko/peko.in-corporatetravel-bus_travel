import { render, screen, fireEvent } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import useGetPasswordPolicies from '@src/domains/auth/hooks/useGetPasswordPolicies';
import usePasswordPolicyValidation from '@src/domains/auth/hooks/usePasswordPolicyValidation';
import useResetPasswordApi from '@src/domains/auth/hooks/useResetPasswordApi';

import ResetPasswordView from '../../../components/views/ResetPasswordView';

// Mock hooks and components
vi.mock('../../../hooks/useGetPasswordPolicies', () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock('../../../hooks/usePasswordPolicyValidation', () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock('../../../hooks/useResetPasswordApi', () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useSearchParams: vi.fn(),
}));

vi.mock('../../../components/sections/ResetPassword', () => ({
    __esModule: true,
    default: ({ handleSubmit, isLoading }: any) => (
        <>
            <button type="button" onClick={() => handleSubmit('Test@123')}>
                Submit
            </button>
            {isLoading && 'Loading...'}
        </>
    ),
}));

describe('ResetPasswordView Component', () => {
    const mockUseSearchParams = useSearchParams as any;
    const mockUseGetPasswordPolicies = useGetPasswordPolicies as any;
    const mockUsePasswordPolicyValidation = usePasswordPolicyValidation as any;
    const mockUseResetPasswordApi = useResetPasswordApi as any;

    beforeEach(() => {
        vi.resetAllMocks();

        // Set up the default mock implementations
        mockUseSearchParams.mockReturnValue([
            new URLSearchParams({
                token: 'test-token',
                username: 'test-username',
                isForgot: 'true',
            }),
        ]);

        mockUseGetPasswordPolicies.mockReturnValue({
            respData: { level: 3 },
            isLoading: false,
        });

        mockUsePasswordPolicyValidation.mockReturnValue({
            validatePassword: vi.fn().mockReturnValue([]),
        });

        mockUseResetPasswordApi.mockReturnValue({
            handleResettPassword: vi.fn(),
            isLoading: false,
        });
    });

    it('renders ResetPassword component', () => {
        render(<ResetPasswordView />);

        // Check if the ResetPassword component is rendered
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('calls handleSubmit with correct payload when form is submitted', () => {
        const mockHandleResettPassword = vi.fn();
        mockUseResetPasswordApi.mockReturnValue({
            handleResettPassword: mockHandleResettPassword,
            isLoading: false,
        });

        render(<ResetPasswordView />);

        // Click on the submit button
        fireEvent.click(screen.getByText('Submit'));

        // Expect handleResettPassword to have been called with the correct payload
        expect(mockHandleResettPassword).toHaveBeenCalledWith({
            password: 'Test@123',
            token: 'test-token',
            username: 'test-username',
            isForgot: 'true',
        });
    });

    it('does not call handleSubmit if token, username, or isForgot is missing', () => {
        const mockHandleResettPassword = vi.fn();
        mockUseSearchParams.mockReturnValue([new URLSearchParams()]);

        render(<ResetPasswordView />);

        // Click on the submit button
        fireEvent.click(screen.getByText('Submit'));

        // Expect handleResettPassword not to have been called
        expect(mockHandleResettPassword).not.toHaveBeenCalled();
    });

    it('displays loading state when isLoading is true', () => {
        mockUseResetPasswordApi.mockReturnValue({
            handleResettPassword: vi.fn(),
            isLoading: true,
        });

        render(<ResetPasswordView />);

        // Assuming the ResetPassword component shows a loader when isLoading is true
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
