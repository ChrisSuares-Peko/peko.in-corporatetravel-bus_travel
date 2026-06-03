import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getOtp } from '../../api';
import useOtpApi from '../../hooks/useOtpApi';
import { nextStep } from '../../slices/registerSlice';

// Mock dependencies
vi.mock('../../api', () => ({
    getOtp: vi.fn(),
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
                            name: 'Test User',
                            phonenumber: '5555555555',
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

describe('useOtpApi', () => {
    let dispatch: any;

    beforeEach(() => {
        dispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        vi.clearAllMocks();
    });

    it('should call getOtp with correct payload in handleOtp', async () => {
        const mockResponse = { status: true, message: 'OTP sent', responseCode: '200', data: {} };
        (getOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleOtp(false, { password: 'password123' });
        });

        expect(getOtp).toHaveBeenCalledWith({
            password: 'password123',
            name: 'Test User',
            mobileNo: '+9715555555555',
            email: 'test@example.com',
            scope: 'email',
            resend: false,
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should dispatch nextStep on successful OTP request without resend', async () => {
        const mockResponse = { status: true, message: 'OTP sent', responseCode: '200', data: {} };
        (getOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleOtp(false);
        });

        expect(nextStep).toHaveBeenCalled();
        expect(showToast).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should dispatch showToast on successful OTP resend', async () => {
        const mockResponse = { status: true, message: 'OTP sent', responseCode: '200', data: {} };
        (getOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleOtp(true);
        });

        expect(nextStep).not.toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith({
            description: 'Your OTP has been successfully sent to your email address',
            variant: 'success',
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure in handleOtp', async () => {
        (getOtp as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleOtp(false);
        });

        expect(nextStep).not.toHaveBeenCalled();
        expect(showToast).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should call getOtp with correct payload in handleMobileResendOtp', async () => {
        const mockResponse = {
            status: true,
            message: 'OTP sent to mobile',
            responseCode: '200',
            data: { phoneOtp: '123456' },
        };
        (getOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleMobileResendOtp(true);
        });

        expect(getOtp).toHaveBeenCalledWith({
            name: 'Test User',
            mobileNo: '9715555555555',
            email: 'test@example.com',
            scope: 'mobile',
            resend: true,
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure in handleMobileResendOtp', async () => {
        (getOtp as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleMobileResendOtp(true);
        });

        expect(nextStep).not.toHaveBeenCalled();
        expect(showToast).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should dispatch showToast on successful OTP resend to mobile', async () => {
        const mockResponse = {
            status: true,
            message: 'OTP sent to mobile',
            responseCode: '200',
            data: { phoneOtp: '123456' },
        };
        (getOtp as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOtpApi());

        await act(async () => {
            await result.current.handleMobileResendOtp(true);
        });

        expect(nextStep).not.toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith({
            description: 'Your OTP has been successfully sent to your mobile number',
            variant: 'success',
        });
        expect(result.current.isLoading).toBe(false);
    });
});
