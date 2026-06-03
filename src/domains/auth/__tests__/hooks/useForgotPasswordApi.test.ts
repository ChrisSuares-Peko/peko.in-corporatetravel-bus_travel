import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';

import { forgotPassword } from '../../api';
import useForgotPasswordApi from '../../hooks/useForgotPasswordApi';
import { forgotpasswordnextStep } from '../../slices/forgotpasswordSlice';

// Mock dependencies
vi.mock('../../api', () => ({
    forgotPassword: vi.fn(),
}));

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/hooks/store');
    return {
        ...actual,
        useAppDispatch: vi.fn(),
    };
});

vi.mock('../../slices/forgotpasswordSlice.ts', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../slices/forgotpasswordSlice.ts');
    return {
        ...actual,
        forgotpasswordnextStep: vi.fn(),
    };
});

describe('useForgotPasswordApi', () => {
    let dispatch: any;

    beforeEach(() => {
        dispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        vi.clearAllMocks();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useForgotPasswordApi());

        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to true during API call', async () => {
        (forgotPassword as any).mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useForgotPasswordApi());

        act(() => {
            result.current.handleForgotPassword({ username: 'testUser' });
        });

        expect(result.current.isLoading).toBe(true);
    });

    it('should call forgotPassword API with correct payload', async () => {
        const mockResponse = {
            status: true,
            message: 'Password reset link sent',
            responseCode: '200',
            data: {},
        };
        (forgotPassword as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useForgotPasswordApi());

        await act(async () => {
            await result.current.handleForgotPassword({ username: 'testUser' });
        });

        expect(forgotPassword).toHaveBeenCalledWith({ username: 'testUser' });
        expect(result.current.isLoading).toBe(false);
        expect(forgotpasswordnextStep).toHaveBeenCalledWith('testUser');
    });

    it('should set isLoading to false after API response', async () => {
        (forgotPassword as any).mockResolvedValueOnce({
            status: true,
            message: 'Password reset link sent',
            responseCode: '200',
            data: {},
        });

        const { result } = renderHook(() => useForgotPasswordApi());

        await act(async () => {
            await result.current.handleForgotPassword({ username: 'testUser' });
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set isLoading to false', async () => {
        (forgotPassword as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useForgotPasswordApi());

        await act(async () => {
            await result.current.handleForgotPassword({ username: 'testUser' });
        });

        expect(forgotpasswordnextStep).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });
});
