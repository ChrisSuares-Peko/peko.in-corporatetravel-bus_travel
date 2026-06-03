import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import PasswordResetForm from '../../components/forms/PasswordResetForm';

const errorMessages = [
    'Password cannot be empty.',
    'Password must be at least 8 characters long.',
    'Password must contain at least one lowercase letter.',
    'Password must contain at least one uppercase letter.',
    'Password must contain at least one number.',
    'Password must contain at least one special character.',
    'Password cannot contain more than 2 consecutive repeated characters.',
];

describe('PasswordResetForm', () => {
    const mockHandleFormSubmit = vi.fn();
    const mockValidatePassword = vi
        .fn()
        .mockReturnValue([
            'Password cannot be empty.',
            'Password must be at least 8 characters long.',
            'Password must contain at least one lowercase letter.',
            'Password must contain at least one uppercase letter.',
            'Password must contain at least one number.',
            'Password must contain at least one special character.',
            'Password cannot contain more than 2 consecutive repeated characters.',
        ]);

    beforeEach(() => {
        cleanup();
        render(
            <PasswordResetForm
                handleFormSubmit={mockHandleFormSubmit}
                isLoading={false}
                validatePassword={mockValidatePassword}
            />
        );
    });

    it('renders the form with initial values', async () => {
        // Check if the form inputs are present
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        await waitFor(() => {
            expect(errorMessages.every(msg => screen.getByText(msg))).toBe(true);
        });
    });

    it('shows validation errors when input fields are focused and left empty', async () => {
        // Focus on the password field and then blur it to simulate leaving it empty
        fireEvent.focus(screen.getByPlaceholderText('New Password'));
        fireEvent.blur(screen.getByPlaceholderText('New Password'));

        // Focus on the confirm password field and then blur it to simulate leaving it empty
        fireEvent.focus(screen.getByPlaceholderText('Confirm Password'));
        fireEvent.blur(screen.getByPlaceholderText('Confirm Password'));

        await waitFor(() => {
            expect(screen.getByText('Please enter your new password')).toBeInTheDocument();
            expect(screen.getByText('Please confirm your new password')).toBeInTheDocument();
        });

        // Ensure that the "Submit" button is still disabled
        expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
    });

    it('shows password validation errors according to the schema', async () => {
        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'test' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'tesst' },
        });
        fireEvent.blur(screen.getByPlaceholderText('Confirm Password'));

        await waitFor(() => {
            expect(screen.getByText('New and confirm passwords must match')).toBeInTheDocument();
        });
    });

    it('submits the form with valid values', async () => {
        // Mock password validation to pass
        mockValidatePassword.mockReturnValue([]);

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'ValidPass123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'ValidPass123!' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Password is valid.')).toBeInTheDocument();
            expect(errorMessages.every(msg => !screen.queryByText(msg))).toBe(true);

            expect(mockHandleFormSubmit).toHaveBeenCalledWith('ValidPass123!');
        });
    });

    it('disables the submit button if the password validation fails', async () => {
        // Mock password validation to fail
        mockValidatePassword.mockReturnValue(['Password must be at least 8 characters long']);

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'short' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'short' },
        });

        await waitFor(() => {
            expect(
                screen.getByText('Password must be at least 8 characters long')
            ).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
        });
    });
});
