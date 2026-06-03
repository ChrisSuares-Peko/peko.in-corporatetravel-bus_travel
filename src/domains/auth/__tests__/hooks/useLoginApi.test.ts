import { renderHook, act } from '@testing-library/react';
import clevertap from 'clevertap-web-sdk';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';

import { signIn } from '../../api';
import useLoginApi from '../../hooks/useLoginApi';
import { loginSuccess } from '../../slices/loginSlice';

// Mock dependencies
vi.mock('../../api', () => ({
    signIn: vi.fn(),
}));

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/hooks/store');
    return {
        ...actual,
        useAppDispatch: vi.fn(),
        useAppSelector: () => ({ auth: { redirectUrl: '/home' } }),
    };
});
vi.mock('react-router-dom', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

vi.mock('../../slices/loginSlice.ts', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('../../slices/loginSlice.ts');
    return {
        ...actual,
        loginSuccess: vi.fn(),
    };
});

describe('useLoginApi', () => {
    let dispatch: any;
    const mockNavigate = vi.fn();
    const mockAuthChannel = { postMessage: vi.fn() };

    beforeEach(() => {
        dispatch = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatch);
        vi.clearAllMocks();
        vi.spyOn(window, 'BroadcastChannel').mockImplementation(() => mockAuthChannel as any);

        // Mock clevertap.onUserLogin.push
        clevertap.onUserLogin = {
            push: vi.fn(),
        };

        // Mock clevertap.event.push
        clevertap.event = {
            push: vi.fn(),
        };
    });

    it('should call signIn API with correct payload', async () => {
        const mockResponse = {
            token: 'token123',
            refreshToken: 'refreshToken123',
            sessionId: 'sessionId123',
            role: 'user',
            id: 1,
            username: 'testUser',
            roleName: 'userRole',
            packageName: 'packageName',
        };
        (signIn as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useLoginApi());

        await act(async () => {
            await result.current.handleLogin({ username: 'testUser', password: 'password' });
        });

        expect(signIn).toHaveBeenCalledWith({ username: 'testUser', password: 'password' });
    });

    it('should navigate to ChangePassword if maxPasswordAge is true', async () => {
        const mockResponse = {
            token: 'token123',
            refreshToken: 'refreshToken123',
            sessionId: 'sessionId123',
            role: 'user',
            id: 1,
            username: 'testUser',
            roleName: 'userRole',
            packageName: 'packageName',
            maxPasswordAge: true,
        };
        (signIn as any).mockResolvedValueOnce(mockResponse);
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        const { result } = renderHook(() => useLoginApi());

        await act(async () => {
            await result.current.handleLogin({ username: 'testUser', password: 'password' });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/auth/ChangePassword', {
            state: {
                userName: 'testUser',
                password: 'password',
            },
        });
    });

    it('should dispatch loginSuccess and postMessage on successful login without maxPasswordAge', async () => {
        const mockResponse = {
            token: 'token123',
            refreshToken: 'refreshToken123',
            sessionId: 'sessionId123',
            role: 'user',
            id: 1,
            username: 'testUser',
            roleName: 'userRole',
            packageName: 'packageName',
        };
        (signIn as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useLoginApi());

        await act(async () => {
            await result.current.handleLogin({ username: 'testUser', password: 'password' });
        });

        expect(dispatch).toHaveBeenCalledWith(
            loginSuccess({
                ...mockResponse,
                isAuthenticated: true,
                redirectUrl: '/home',
            })
        );
        expect(mockAuthChannel.postMessage).toHaveBeenCalledWith({
            type: 'login',
            tabId: expect.any(String),
        });
    });

    it('should call clevertap.onUserLogin.push and clevertap.event.push on successful login', async () => {
        const mockResponse = {
            token: 'token123',
            refreshToken: 'refreshToken123',
            sessionId: 'sessionId123',
            role: 'user',
            id: 1,
            username: 'testUser',
            roleName: 'userRole',
            packageName: 'packageName',
        };
        (signIn as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useLoginApi());

        await act(async () => {
            await result.current.handleLogin({ username: 'testUser', password: 'password' });
        });

        expect(clevertap.onUserLogin.push).toHaveBeenCalledWith({
            Site: {
                Identity: 'testUser',
                Name: 'testUser',
                last_login_date: expect.any(String),
            },
        });
        expect(clevertap.event.push).toHaveBeenCalledWith('userlogin', {
            Page: 'loginPage',
            Action: 'user logined',
        });
    });

    it('should handle API failure gracefully', async () => {
        (signIn as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useLoginApi());

        await act(async () => {
            await result.current.handleLogin({ username: 'testUser', password: 'password' });
        });

        expect(dispatch).not.toHaveBeenCalled();
        expect(mockAuthChannel.postMessage).not.toHaveBeenCalled();
        expect(clevertap.onUserLogin.push).not.toHaveBeenCalled();
        expect(clevertap.event.push).not.toHaveBeenCalled();
    });
});
