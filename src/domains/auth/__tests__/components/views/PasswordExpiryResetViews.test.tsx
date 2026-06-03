import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import PasswordExpiryResetViews from '../../../components/views/PasswordExpiryResetViews';
import useGetPasswordPolicies from '../../../hooks/useGetPasswordPolicies';
import usePasswordExpiryReset from '../../../hooks/usePasswordExpiryReset';
import usePasswordPolicyValidation from '../../../hooks/usePasswordPolicyValidation';

// Mock the subcomponents
vi.mock('../../../components/sections/PasswordExpiryResetStep1', () => ({
    __esModule: true,
    default: ({ setCurrentStep }: { setCurrentStep: (step: number) => void }) => (
        <div>
            <p>Mocked PasswordExpiryResetStep1</p>
            <button type="button" onClick={() => setCurrentStep(2)}>
                Next Step
            </button>
        </div>
    ),
}));

vi.mock('../../../components/sections/PasswordExpiryResetStep2', () => ({
    __esModule: true,
    default: ({ handleSubmit, isLoading, validatePassword }: any) => (
        <div>
            <p>Mocked PasswordExpiryResetStep2</p>
            <button type="button" onClick={() => handleSubmit('newpassword')}>
                Submit
            </button>
            {isLoading && <p>Loading...</p>}
        </div>
    ),
}));

// Mock the hooks
vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(),
}));

vi.mock('../../../hooks/useGetPasswordPolicies');
vi.mock('../../../hooks/usePasswordExpiryReset');
vi.mock('../../../hooks/usePasswordPolicyValidation');

describe('PasswordExpiryResetViews Component', () => {
    const mockUseLocation = useLocation as any;
    const mockUsePasswordExpiryReset = usePasswordExpiryReset as any;
    const mockUseGetPasswordPolicies = useGetPasswordPolicies as any;
    const mockUsePasswordPolicyValidation = usePasswordPolicyValidation as any;

    const mockHandleResettPassword = vi.fn();
    const mockValidatePassword = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        mockUseLocation.mockReturnValue({
            state: { userName: 'testuser' },
        });

        mockUsePasswordExpiryReset.mockReturnValue({
            handleResettPassword: mockHandleResettPassword,
            isLoading: false,
            userData: { userName: 'testuser', password: 'oldpassword' },
        });

        mockUseGetPasswordPolicies.mockReturnValue({
            respData: { minLength: 8, level: 3 },
            isLoading: false,
        });

        mockUsePasswordPolicyValidation.mockReturnValue({
            validatePassword: mockValidatePassword,
        });
    });

    it('renders PasswordExpiryResetStep1 when currentStep is 1', () => {
        render(<PasswordExpiryResetViews />);

        // Check if the mocked PasswordExpiryResetStep1 is rendered
        expect(screen.getByText('Mocked PasswordExpiryResetStep1')).toBeInTheDocument();
    });

    it('renders PasswordExpiryResetStep2 when currentStep is 2', () => {
        render(<PasswordExpiryResetViews />);

        // Simulate moving to step 2
        fireEvent.click(screen.getByText('Next Step'));

        // Check if the mocked PasswordExpiryResetStep2 is rendered
        expect(screen.getByText('Mocked PasswordExpiryResetStep2')).toBeInTheDocument();
    });

    it('calls handleResettPassword with correct payload on submission', () => {
        render(<PasswordExpiryResetViews />);

        // Simulate moving to step 2
        fireEvent.click(screen.getByText('Next Step'));

        // Simulate form submission in step 2
        fireEvent.click(screen.getByText('Submit'));

        // Expect handleResettPassword to have been called with the correct payload
        expect(mockHandleResettPassword).toHaveBeenCalledWith({
            password: 'oldpassword',
            newPassword: 'newpassword',
            username: 'testuser',
        });
    });
});
