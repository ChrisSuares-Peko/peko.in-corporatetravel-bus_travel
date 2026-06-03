import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LoginForm from '../../components/forms/LoginForm';
import useLoginApi from '../../hooks/useLoginApi';

// Mock useLoginApi hook
vi.mock('../../hooks/useLoginApi');

describe('LoginForm', () => {
    const mockHandleLogin = vi.fn();

    beforeEach(() => {
        vi.mocked(useLoginApi).mockReturnValue({
            handleLogin: mockHandleLogin,
        });

        cleanup();
        render(
            <Router>
                <LoginForm />
            </Router>
        );
    });

    it('renders the form correctly', () => {
        // Check for presence of input fields
        expect(screen.getByPlaceholderText('Email ID/Account Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

        // Check for submit button and link
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    it('submits the form with valid values', async () => {
        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText('Email ID/Account Number'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Check if handleLogin was called with correct arguments
        await waitFor(() => {
            expect(mockHandleLogin).toHaveBeenCalledWith(
                {
                    username: 'test@example.com',
                    password: 'password123',
                },
                expect.any(Object)
            );
        });
    });

    it('shows validation errors for required fields', async () => {
        // Submit the form without filling it
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Check for error messages
        expect(
            await screen.findByText('Please enter the email id or account number')
        ).toBeInTheDocument();
        expect(await screen.findByText('Please enter the password')).toBeInTheDocument();
    });

    it('shows validation errors for invalid username', async () => {
        // Fill invalid username and submit
        fireEvent.change(screen.getByPlaceholderText('Email ID/Account Number'), {
            target: { value: 'inva*lid##domain.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Check for validation errors
        expect(
            await screen.findByText('Please enter a valid email id or account number')
        ).toBeInTheDocument();
    });

    it('shows validation errors for invalid password', async () => {
        // Leave password empty and submit
        fireEvent.change(screen.getByPlaceholderText('Email ID/Account Number'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Check for validation errors
        expect(await screen.findByText('Please enter the password')).toBeInTheDocument();
    });
});
