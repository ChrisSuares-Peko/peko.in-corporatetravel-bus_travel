import { renderHook, act } from '@testing-library/react';
import clevertap from 'clevertap-web-sdk';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { signUp } from '../../api';
import useRegistrationApi from '../../hooks/useRegistrationApi';
import { nextStep, setLoginData } from '../../slices/registerSlice';

// Mocking dependencies
vi.mock('clevertap-web-sdk');
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('../../api', () => ({
    signUp: vi.fn(),
}));
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
        setLoginData: vi.fn(),
    };
});

describe('useRegistrationApi', () => {
    let dispatch: any;

    beforeEach(() => {
        dispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        (useAppSelector as any).mockReturnValue({
            formData: {
                contactPersonName: 'John Doe',
                phonenumber: '1234567890',
                email: 'test@example.com',
                name: 'Test Company',
                password: 'password123',
                referralCode: 'REF123',
            },
        });

        // Mock clevertap.onUserLogin.push
        clevertap.onUserLogin = {
            push: vi.fn(),
        };

        // Mock clevertap.event.push
        clevertap.event = {
            push: vi.fn(),
        };
    });

    it('should show a warning toast if OTP is less than 6 characters', async () => {
        const { result } = renderHook(() => useRegistrationApi());

        await act(async () => {
            await result.current.handleSignup('123');
        });

        expect(dispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Please enter a valid OTP',
                variant: 'warning',
            })
        );
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('should set isError to true and isLoading to false when signUp fails', async () => {
        (signUp as any).mockResolvedValue(false);

        const { result } = renderHook(() => useRegistrationApi());

        await act(async () => {
            await result.current.handleSignup('123456');
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(dispatch).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        expect(clevertap.onUserLogin.push).not.toHaveBeenCalled();
        expect(clevertap.event.push).not.toHaveBeenCalled();
    });

    it('should call clevertap and dispatch actions when signUp is successful', async () => {
        const mockResponse = {
            kycStatus: 'Pending',
            isActive: true,
            isMFA: true,
            sendMfaCodeToEmail: true,
            sendMfaCodeToPhone: true,
            sendMfaCodeToAuthApp: true,
            id: 1,
            name: 'John Doe',
            countryCode: '971',
            mobileNo: '1234567890',
            email: 'test@example.com',
            companyName: 'Test Company',
            credentialId: 1001,
            registeredBy: null,
            packageId: 1,
            updatedAt: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
        };
        (signUp as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRegistrationApi());

        await act(async () => {
            await result.current.handleSignup('123456');
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(dispatch).toHaveBeenCalledWith(setLoginData(mockResponse));
        expect(dispatch).toHaveBeenCalledWith(nextStep());
        expect(clevertap.onUserLogin.push).toHaveBeenCalledWith({
            Site: {
                Identity: 'test@example.com',
            },
        });
        expect(clevertap.event.push).toHaveBeenCalledWith('userSignup', {
            Page: 'signup page',
            Action: 'user joined',
        });
    });

    it('should set isLoading to false when signUp is successful', async () => {
        const mockResponse = {
            kycStatus: 'Pending',
            isActive: true,
            isMFA: true,
            sendMfaCodeToEmail: true,
            sendMfaCodeToPhone: true,
            sendMfaCodeToAuthApp: true,
            id: 1,
            name: 'John Doe',
            countryCode: '971',
            mobileNo: '1234567890',
            email: 'test@example.com',
            companyName: 'Test Company',
            credentialId: 1001,
            registeredBy: null,
            packageId: 1,
            updatedAt: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
        };
        (signUp as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRegistrationApi());

        await act(async () => {
            await result.current.handleSignup('123456');
        });

        expect(result.current.isLoading).toBe(false);
    });
});
