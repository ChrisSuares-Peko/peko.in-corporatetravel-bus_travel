import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { paths } from '@src/routes/paths';

import { ChangePassword } from '../../api';
import usePasswordExpiryReset from '../../hooks/usePasswordExpiryReset';
import { passwordUserData } from '../../types';

vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

vi.mock('../../api', () => ({
    ChangePassword: vi.fn(),
}));

describe('usePasswordExpiryReset', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => usePasswordExpiryReset(null));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.userData).toBeUndefined();
    });

    it('should set userData if state is provided', () => {
        const mockState: passwordUserData = { password: 'oldPassword', userName: 'testUser' };
        const { result } = renderHook(() => usePasswordExpiryReset(mockState));

        expect(result.current.userData).toEqual(mockState);
    });

    it('should navigate to login if state is not provided', () => {
        renderHook(() => usePasswordExpiryReset(null));
        expect(mockNavigate).toHaveBeenCalledWith(paths.auth.jwt.login);
    });

    it('should call ChangePassword API and navigate on successful password reset', async () => {
        const mockResponse = {
            status: true,
            message: 'Password reset successful',
            responseCode: '200',
            data: {},
        };

        (ChangePassword as any).mockResolvedValueOnce(mockResponse);
        const mockState: passwordUserData = { password: 'oldPassword', userName: 'testUser' };
        const { result } = renderHook(() => usePasswordExpiryReset(mockState));

        act(() => {
            result.current.handleResettPassword({
                password: 'oldPassword',
                newPassword: 'newPassword',
                username: 'testUser',
            });
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(mockNavigate).toHaveBeenCalledWith(paths.auth.passwordSuccess, {
                state: { isForgot: true },
            });
        });

        expect(ChangePassword).toHaveBeenCalledWith({
            password: 'oldPassword',
            newPassword: 'newPassword',
            username: 'testUser',
        });
    });

    it('should handle API failure and not navigate', async () => {
        (ChangePassword as any).mockResolvedValueOnce(false);
        const mockState: passwordUserData = { password: 'oldPassword', userName: 'testUser' };
        const { result } = renderHook(() => usePasswordExpiryReset(mockState));

        act(() => {
            result.current.handleResettPassword({
                password: 'oldPassword',
                newPassword: 'newPassword',
                username: 'testUser',
            });
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should set isLoading to true during API call', async () => {
        (ChangePassword as any).mockImplementation(() => new Promise(() => {}));

        const mockState: passwordUserData = { password: 'oldPassword', userName: 'testUser' };
        const { result } = renderHook(() => usePasswordExpiryReset(mockState));

        act(() => {
            result.current.handleResettPassword({
                password: 'oldPassword',
                newPassword: 'newPassword',
                username: 'testUser',
            });
        });

        expect(result.current.isLoading).toBe(true);
    });
});
