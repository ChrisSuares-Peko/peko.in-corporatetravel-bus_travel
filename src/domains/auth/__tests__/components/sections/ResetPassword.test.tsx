import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { paths } from '@src/routes/paths';

import ResetPassword from '../../../components/sections/ResetPassword';

// Mock dependencies
vi.mock('../../../components/forms/ResetPasswordForm.tsx', () => ({
    default: vi.fn(({ handleFormSubmit, isLoading, validatePassword }) => (
        <form
            onSubmit={e => {
                e.preventDefault();
                handleFormSubmit('mock-token');
            }}
        >
            <button type="submit" disabled={isLoading}>
                Submit
            </button>
        </form>
    )),
}));

describe('ResetPassword Component', () => {
    const mockHandleSubmit = vi.fn();
    const mockValidatePassword = vi.fn(() => []);
    const mockIsLoading = false;
    const mockIsForgot = true;

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders all elements correctly', () => {
        render(
            <Router>
                <ResetPassword
                    handleSubmit={mockHandleSubmit}
                    isLoading={mockIsLoading}
                    validatePassword={mockValidatePassword}
                    isForgot={mockIsForgot}
                />
            </Router>
        );

        // Check if the title text is correct
        expect(screen.getByText('Reset Password')).toBeInTheDocument();

        // Check if the "Go back" link is present
        expect(screen.getByText('Go back')).toBeInTheDocument();

        // Check if the background image text is present
        expect(
            screen.getByText(
                /All-in-one platform for SMBs to manage all their payments, expenses, travel, insurance, and automate operations/i
            )
        ).toBeInTheDocument();
    });

    it('navigates to login page when "Go back" is clicked', () => {
        render(
            <Router>
                <ResetPassword
                    handleSubmit={mockHandleSubmit}
                    isLoading={mockIsLoading}
                    validatePassword={mockValidatePassword}
                    isForgot={mockIsForgot}
                />
            </Router>
        );

        // Check if "Go back" link is present
        const goBackLink = screen.getByText('Go back');

        fireEvent.click(goBackLink);

        // Verify that navigation occurred
        expect(window.location.pathname).toBe(paths.auth.jwt.login);
    });

    it('renders correct title based on isForgot prop', () => {
        // Test for when isForgot is true
        render(
            <Router>
                <ResetPassword
                    handleSubmit={mockHandleSubmit}
                    isLoading={mockIsLoading}
                    validatePassword={mockValidatePassword}
                    isForgot
                />
            </Router>
        );
        expect(screen.getByText('Reset Password')).toBeInTheDocument();

        // Test for when isForgot is false
        render(
            <Router>
                <ResetPassword
                    handleSubmit={mockHandleSubmit}
                    isLoading={mockIsLoading}
                    validatePassword={mockValidatePassword}
                    isForgot={false}
                />
            </Router>
        );
        expect(screen.getByText('Set Password')).toBeInTheDocument();
    });
});
