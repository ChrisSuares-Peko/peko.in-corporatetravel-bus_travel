import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Grid } from 'antd';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import ForgotPasswordStepOne from '../../../components/sections/ForgotPasswordStepOne';
import useForgotPasswordApi from '../../../hooks/useForgotPasswordApi';
import { forgotpasswordReset } from '../../../slices/forgotpasswordSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('../../../hooks/useForgotPasswordApi', () => ({
    default: vi.fn(),
}));

vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

vi.mock('../../../slices/forgotpasswordSlice', () => ({
    forgotpasswordReset: vi.fn(),
}));

// Mock Ant Design's Grid.useBreakpoint
vi.mock('antd', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('antd');
    return {
        ...actual,
        Grid: {
            ...actual.Grid,
            useBreakpoint: vi.fn(),
        },
    };
});

describe('ForgotPasswordStepOne Component', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockHandleForgotPassword = vi.fn();
    const mockForgotpasswordReset = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    forgotpassword: {
                        email: 'test@example.com',
                    },
                },
            })
        );

        (useForgotPasswordApi as any).mockReturnValue({
            handleForgotPassword: mockHandleForgotPassword,
            isLoading: false,
        });

        (forgotpasswordReset as any).mockReturnValue({ type: 'forgotpassword/reset' });
        (Grid.useBreakpoint as any).mockReturnValue({ xxl: false });
    });

    it('renders all elements correctly', () => {
        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });

        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Enter the email id associated with your account, and we'll send you a link to reset your password."
            )
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email id/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
        expect(screen.getByText('Go back to Login')).toBeInTheDocument();
    });

    it('initializes the form with email from the store', () => {
        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });
        const emailInput = screen.getByPlaceholderText(/Enter your email id/i) as HTMLInputElement;
        expect(emailInput.value).toBe('test@example.com');
    });

    it('calls handleForgotPassword with correct values on form submit', async () => {
        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });

        const emailInput = screen.getByPlaceholderText(/Enter your email id/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /Send Reset Link/i });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockHandleForgotPassword).toHaveBeenCalledWith(
                {
                    username: 'user@example.com',
                },
                expect.any(Object)
            );
        });
    });

    it('displays validation error for invalid email', async () => {
        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });

        const emailInput = screen.getByPlaceholderText(/Enter your email id/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /Send Reset Link/i });

        fireEvent.change(emailInput, { target: { value: 'inv##alid-email@f.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument();
        });

        expect(mockHandleForgotPassword).not.toHaveBeenCalled();
    });

    it('handles form submission and does not navigate on successful submission', async () => {
        mockHandleForgotPassword.mockResolvedValueOnce(true);
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });

        const emailInput = screen.getByPlaceholderText(/Enter your email id/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /Send Reset Link/i });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockHandleForgotPassword).toHaveBeenCalledWith(
                {
                    username: 'user@example.com',
                },
                expect.any(Object)
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('dispatches forgotpasswordReset and navigates to login when "Go back to Login" is clicked', () => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        render(<ForgotPasswordStepOne />, { wrapper: BrowserRouter });

        const backToLogin = screen.getByText('Go back to Login');
        fireEvent.click(backToLogin);

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'forgotpassword/reset' });
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
});
