import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import SocialButtons from '../../../components/sections/SocialButtons';
import { resetRegisterState } from '../../../slices/registerSlice';

// Mock the useDispatch hook
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));

describe('SocialButtons Component', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
    });

    it('renders all elements correctly', () => {
        render(
            <Router>
                <SocialButtons />
            </Router>
        );

        // Check if the description text is present
        expect(
            screen.getByText(/Ready to begin using Peko for your business\?/i)
        ).toBeInTheDocument();

        // Check if the "Sign up" text is present and clickable
        expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('dispatches resetRegisterState action when "Sign up" text is clicked', () => {
        render(
            <Router>
                <SocialButtons />
            </Router>
        );

        // Find and click the "Sign up" text element
        fireEvent.click(screen.getByText('Sign up'));

        // Check if resetRegisterState action is dispatched
        expect(mockDispatch).toHaveBeenCalledWith(resetRegisterState());
    });

    it('navigates to /auth/register when "Sign up" text is clicked', () => {
        render(
            <Router>
                <SocialButtons />
            </Router>
        );

        // Find and click the "Sign up" text element
        const signUpLink = screen.getByText('Sign up');
        fireEvent.click(signUpLink);

        // Verify that navigation to /auth/register occurred
        expect(window.location.pathname).toBe('/auth/register');
    });
});
