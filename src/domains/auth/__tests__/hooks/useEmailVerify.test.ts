import { renderHook, act, cleanup } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { verifyEmailOtp } from '../../api';
import useVerifyEmailOtpApi from '../../hooks/useEmailVerify';
import { nextStep } from '../../slices/registerSlice';

vi.mock('../../api', () => ({
    verifyEmailOtp: vi.fn(),
}));

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/hooks/store');
    return {
        ...actual,
        useAppDispatch: vi.fn(),
        useAppSelector: (selector: any) =>
            selector({
                reducer: {
                    registration: {
                        formData: {
                            phonenumber: '123456789',
                            email: 'test@example.com',
                        },
                    },
                },
            }),
    };
});

vi.mock('@src/slices/apiSlice', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/slices/apiSlice');
    return {
        ...actual,
        showToast: vi.fn(),
    };
});

vi.mock('../../slices/registerSlice', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../slices/registerSlice');
    return {
        ...actual,
        nextStep: vi.fn(),
    };
});

describe('useVerifyEmailOtpApi', () => {
    let dispatch: any;

    beforeEach(() => {
        cleanup();
        dispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        vi.clearAllMocks();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useVerifyEmailOtpApi());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('should show a warning if OTP length is less than 6', async () => {
        const { result } = renderHook(() => useVerifyEmailOtpApi());

        await act(async () => {
            await result.current.handleVerifyOtp('12345');
        });

        expect(showToast).toHaveBeenCalledWith({
            description: 'Please enter a valid OTP',
            variant: 'warning',
        });
        expect(verifyEmailOtp).not.toHaveBeenCalled();
    });

    it('should call verifyEmailOtp API with correct payload', async () => {
        const mockResponse = {
            status: true,
            message: 'OTP verified',
            responseCode: '200',
            data: { phoneOtp: '987654' },
        };
        (verifyEmailOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useVerifyEmailOtpApi());

        await act(async () => {
            await result.current.handleVerifyOtp('123456');
        });

        expect(verifyEmailOtp).toHaveBeenCalledWith({
            mobileNo: '971123456789',
            email: 'test@example.com',
            emailOtp: '123456',
        });
        expect(result.current.isLoading).toBe(false);
        expect(nextStep).toHaveBeenCalled();
    });

    it('should set isError to true if API call fails', async () => {
        (verifyEmailOtp as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useVerifyEmailOtpApi());

        await act(async () => {
            await result.current.handleVerifyOtp('123456');
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(true);
    });

    it('should set isLoading to true during API call', async () => {
        (verifyEmailOtp as any).mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useVerifyEmailOtpApi());

        act(() => {
            result.current.handleVerifyOtp('123456');
        });

        expect(result.current.isLoading).toBe(true);
    });

    it('should reset isLoading and isError after API response', async () => {
        (verifyEmailOtp as any).mockResolvedValueOnce({
            status: true,
            message: 'OTP verified',
            responseCode: '200',
            data: { phoneOtp: '987654' },
        });

        const { result } = renderHook(() => useVerifyEmailOtpApi());

        await act(async () => {
            await result.current.handleVerifyOtp('123456');
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });
});
