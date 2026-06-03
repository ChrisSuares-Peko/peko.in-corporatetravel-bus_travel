import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockStoreEnhanced } from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { store, createTestStore } from '@store/store';

import RegisterStepTwoForm from '../../components/forms/RegisterStepTwoForm';
import useOtpApi from '../../hooks/useOtpApi';
import usePasswordValidation from '../../hooks/usePasswordValidation';
import { setFormData } from '../../slices/registerSlice';

const errorMessages = [
    'Password cannot be empty.',
    'Password must be at least 8 characters long.',
    'Password must contain at least one lowercase letter.',
    'Password must contain at least one uppercase letter.',
    'Password must contain at least one number.',
    'Password must contain at least one special character.',
    'Password cannot contain more than 2 consecutive repeated characters.',
];

// Mock the custom hooks and Redux hooks
vi.mock('../../hooks/useOtpApi.ts', () => ({
    default: vi.fn().mockReturnValue({
        handleOtp: vi.fn(),
        isLoading: false,
    }),
}));

vi.mock('../../hooks/usePasswordValidation', () => ({
    default: vi.fn().mockReturnValue({
        validatePassword: vi
            .fn()
            .mockReturnValue([
                'Password cannot be empty.',
                'Password must be at least 8 characters long.',
                'Password must contain at least one lowercase letter.',
                'Password must contain at least one uppercase letter.',
                'Password must contain at least one number.',
                'Password must contain at least one special character.',
                'Password cannot contain more than 2 consecutive repeated characters.',
            ]),
    }),
}));

describe('RegisterStepTwoForm', () => {
    let mockStore: MockStoreEnhanced<unknown, {}>;

    beforeEach(() => {
        mockStore = createTestStore(store.getState());
        cleanup();
        render(
            <Provider store={mockStore}>
                <Router>
                    <RegisterStepTwoForm />
                </Router>
            </Provider>
        );
    });

    it('renders the form with initial values', () => {
        // Check for form inputs
        expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(errorMessages.every(msg => screen.getByText(msg))).toBe(true);
    });

    it('shows validation errors when input fields are focused and left empty', async () => {
        // Focus on the password field and then blur it to simulate leaving it empty
        fireEvent.focus(screen.getByPlaceholderText('Enter Password'));
        fireEvent.blur(screen.getByPlaceholderText('Enter Password'));

        // Focus on the confirm password field and then blur it to simulate leaving it empty
        fireEvent.focus(screen.getByPlaceholderText('Confirm Password'));
        fireEvent.blur(screen.getByPlaceholderText('Confirm Password'));

        await waitFor(() => {
            expect(screen.getByText('Please enter your password')).toBeInTheDocument();
            expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
        });

        // Ensure that the "Next" button is still disabled
        expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
    });

    it('shows password validation errors according to schema', async () => {
        fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
            target: { value: 'test' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'haha' },
        });
        fireEvent.blur(screen.getByPlaceholderText('Confirm Password'));

        await waitFor(() => {
            expect(
                screen.getByText('Password and confirm password must match')
            ).toBeInTheDocument();
        });
    });

    it('submits the form with valid values and triggers OTP', async () => {
        const mockHandleOtp = vi.mocked(useOtpApi).mock.results[0].value.handleOtp;
        const mockValidatePassword =
            vi.mocked(usePasswordValidation).mock.results[0].value.validatePassword;

        // Mock password validation to pass
        mockValidatePassword.mockReturnValue([]);

        fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
            target: { value: 'ValidPass123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'ValidPass123!' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        await waitFor(() => {
            expect(screen.getByText('Password is valid.')).toBeInTheDocument();
            expect(errorMessages.every(msg => !screen.queryByText(msg))).toBe(true);
            const actions = mockStore.getActions();

            expect(actions).toContainEqual(
                setFormData({
                    password: 'ValidPass123!',
                    confirmpassword: 'ValidPass123!',
                })
            );

            expect(mockHandleOtp).toHaveBeenCalledWith(false, {
                password: 'ValidPass123!',
                confirmpassword: 'ValidPass123!',
            });
        });
    });

    it('disables the submit button if the password validation fails', async () => {
        const mockValidatePassword =
            vi.mocked(usePasswordValidation).mock.results[0].value.validatePassword;

        // Mock password validation to fail
        mockValidatePassword.mockReturnValue(['Password must be at least 8 characters long']);

        fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
            target: { value: 'short' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'short' },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
        });
    });
});
