import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { paths } from '@src/routes/paths';

import { ResetPassword } from '../../api';
import useResetPasswordApi from '../../hooks/useResetPasswordApi';

// Mock dependencies
vi.mock('../../api', () => ({
    ResetPassword: vi.fn(),
}));

vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('useResetPasswordApi', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.clearAllMocks();
    });

    it('should handle password reset successfully and navigate to success page', async () => {
        const mockResponse = {
            status: true,
            message: 'Password reset successfully',
            responseCode: '200',
            data: {},
        };
        (ResetPassword as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useResetPasswordApi());

        await act(async () => {
            await result.current.handleResettPassword({
                password: 'newPassword',
                token: 'resetToken123',
                username: 'testUser',
                isForgot: 'true',
            });
        });

        expect(ResetPassword).toHaveBeenCalledWith({
            password: 'newPassword',
            token: 'resetToken123',
            username: 'testUser',
            isForgot: 'true',
        });

        expect(mockNavigate).toHaveBeenCalledWith(paths.auth.passwordSuccess, {
            state: {
                isForgot: 'true',
            },
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure gracefully', async () => {
        (ResetPassword as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useResetPasswordApi());

        await act(async () => {
            await result.current.handleResettPassword({
                password: 'newPassword',
                token: 'resetToken123',
                username: 'testUser',
                isForgot: 'true',
            });
        });

        expect(ResetPassword).toHaveBeenCalledWith({
            password: 'newPassword',
            token: 'resetToken123',
            username: 'testUser',
            isForgot: 'true',
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to true while the API call is in progress', async () => {
        (ResetPassword as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { result } = renderHook(() => useResetPasswordApi());

        act(() => {
            result.current.handleResettPassword({
                password: 'newPassword',
                token: 'resetToken123',
                username: 'testUser',
                isForgot: 'true',
            });
        });

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            // Wait for the mock API to resolve
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to false after the API call regardless of success or failure', async () => {
        (ResetPassword as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useResetPasswordApi());

        await act(async () => {
            await result.current.handleResettPassword({
                password: 'newPassword',
                token: 'resetToken123',
                username: 'testUser',
                isForgot: 'true',
            });
        });

        expect(result.current.isLoading).toBe(false);
    });
});
