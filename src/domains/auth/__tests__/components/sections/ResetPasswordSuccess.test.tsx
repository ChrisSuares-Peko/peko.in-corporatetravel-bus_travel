import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import ResetPasswordSuccess from '../../../components/sections/ResetPasswordSuccess';

// Mock the useLocation hook
vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

describe('ResetPasswordSuccess Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders all elements correctly when state.isForgot is true', () => {
        // Mock useLocation to return state with isForgot as 'true'
        (useLocation as any).mockReturnValue({
            state: { isForgot: 'true' },
        });

        render(
            <Router>
                <ResetPasswordSuccess />
            </Router>
        );

        // Check if the "Password Updated" text is present
        expect(screen.getByText('Password Updated')).toBeInTheDocument();

        // Check if the "Login" link is present
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders all elements correctly when state.isForgot is false', () => {
        // Mock useLocation to return state with isForgot as 'false'
        (useLocation as any).mockReturnValue({
            state: { isForgot: 'false' },
        });

        render(
            <Router>
                <ResetPasswordSuccess />
            </Router>
        );

        // Check if the "Password Created" text is present
        expect(screen.getByText('Password Created')).toBeInTheDocument();

        // Check if the "Login" link is present
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders all elements correctly when state.isForgot is not provided', () => {
        // Mock useLocation to return state without isForgot
        (useLocation as any).mockReturnValue({
            state: {},
        });

        render(
            <Router>
                <ResetPasswordSuccess />
            </Router>
        );

        // Check if the "Password Created" text is present by default
        expect(screen.getByText('Password Created')).toBeInTheDocument();

        // Check if the "Login" link is present
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('navigates to login page when "Login" link is clicked', () => {
        // Mock useLocation to return any state
        (useLocation as any).mockReturnValue({
            state: {},
        });

        render(
            <Router>
                <ResetPasswordSuccess />
            </Router>
        );

        // Check if the "Login" link is present
        const loginLink = screen.getByText('Login');

        // Simulate clicking the "Login" link
        fireEvent.click(loginLink);

        // Verify that navigation occurred
        expect(window.location.pathname).toBe('/auth/login');
    });
});
