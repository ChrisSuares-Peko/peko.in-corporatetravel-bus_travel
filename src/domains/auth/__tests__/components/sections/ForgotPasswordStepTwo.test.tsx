import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import ForgotPasswordStepTwo from '../../../components/sections/ForgotPasswordStepTwo';
import useForgotPasswordApi from '../../../hooks/useForgotPasswordApi';
import {
    forgotpasswordReset,
    forgotpasswordpreviousStep,
} from '../../../slices/forgotpasswordSlice';

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
    forgotpasswordpreviousStep: vi.fn(),
}));

describe('ForgotPasswordStepTwo Component', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockHandleForgotPassword = vi.fn();

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
        (forgotpasswordpreviousStep as any).mockReturnValue({
            type: 'forgotpassword/previousStep',
        });
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('renders all elements correctly', () => {
        render(<ForgotPasswordStepTwo />, { wrapper: BrowserRouter });

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            'Check your email for reset link'
        );
        expect(
            screen.getByText(/A verification link has been sent to your email id/)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Please click on the link to reset your password/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Didn’t get it?/)).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('handles "Resend Email" link click correctly', async () => {
        render(<ForgotPasswordStepTwo />, { wrapper: BrowserRouter });

        const resendLink = screen.getByText(/Resend Email/);

        fireEvent.click(resendLink);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'forgotpassword/previousStep' });
        });
    });

    it('displays "Sending..." text when isLoading is true', async () => {
        (useForgotPasswordApi as any).mockReturnValue({
            handleForgotPassword: mockHandleForgotPassword,
            isLoading: true,
        });

        render(<ForgotPasswordStepTwo />, { wrapper: BrowserRouter });

        const sendingText = screen.getByText('Sending...');

        expect(sendingText).toBeInTheDocument();
    });

    it('dispatches forgotpasswordReset and navigates to login when "Login" button is clicked', () => {
        render(<ForgotPasswordStepTwo />, { wrapper: BrowserRouter });

        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'forgotpassword/reset' });
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
});
