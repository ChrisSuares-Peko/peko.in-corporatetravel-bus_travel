import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';

import {
    getSecurityInfo,
    updateSecurityInfo,
} from '@src/domains/dashboard/profile/api/securityInfo';
import useSecurityInfoApi from '@src/domains/dashboard/profile/hooks/useSecurityInfoApi';
import { setData } from '@src/domains/dashboard/profile/slices/securityInfo';
import {
    SecurityInfoResponse,
    SecurityInfoUpdatePayload,
} from '@src/domains/dashboard/profile/types';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/api/securityInfo', () => ({
    getSecurityInfo: vi.fn(),
    updateSecurityInfo: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/slices/securityInfo', () => ({
    setData: vi.fn(),
}));

describe('useSecurityInfoApi', () => {
    const dispatch = vi.fn();
    const mockData: SecurityInfoResponse = {
        sendMfaCodeToEmail: 1,
        sendMfaCodeToPhone: 1,
        sendMfaCodeToAuthApp: 1,
    };

    beforeEach(() => {
        (useAppSelector as any).mockImplementation(
            (
                selector: (arg0: {
                    reducer: {
                        auth: { role: string; id: string };
                        securityInfo: {
                            refresh: boolean;
                            data: SecurityInfoResponse;
                            isLoading: boolean;
                            isEditLoading: boolean;
                        };
                    };
                }) => any
            ) =>
                selector({
                    reducer: {
                        auth: { role: 'user', id: '123' },
                        securityInfo: {
                            refresh: false,
                            data: mockData,
                            isLoading: false,
                            isEditLoading: false,
                        },
                    },
                })
        );

        (useAppDispatch as any).mockReturnValue(dispatch);
        (getSecurityInfo as any).mockResolvedValue(mockData);
        (updateSecurityInfo as any).mockResolvedValue({ result: [1], docs: {} });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and set user security info on mount', async () => {
        const { result } = renderHook(() => useSecurityInfoApi({}));

        await waitFor(() => {
            expect(getSecurityInfo).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
            expect(setData).toHaveBeenCalledWith({ data: mockData, isLoading: false });
            expect(result.current.data).toEqual(mockData);
        });
    });

    it('should handle update security info', async () => {
        const { result } = renderHook(() => useSecurityInfoApi({ handleCancel: vi.fn() }));
        const payload: SecurityInfoUpdatePayload = {
            sendMfaCodeToEmail: 0,
            sendMfaCodeToPhone: 1,
            sendMfaCodeToAuthApp: 1,
            otp: '123456',
            userId: 0,
            userType: '',
        };

        await act(async () => {
            await result.current.handleUpdateSecurityInfo(payload);
        });

        await waitFor(() => {
            expect(updateSecurityInfo).toHaveBeenCalledWith(payload);
            expect(setData).toHaveBeenCalledWith({
                refresh: true,
                isLoading: false,
                isEditLoading: false,
            });
            expect(showToast).toHaveBeenCalledWith({
                description: 'Security info updated successfully',
                variant: 'success',
            });
        });
    });

    it('should handle update security info failure', async () => {
        (updateSecurityInfo as any).mockResolvedValueOnce(false); // Simulate failure

        const { result } = renderHook(() => useSecurityInfoApi({ handleCancel: vi.fn() }));
        const payload: SecurityInfoUpdatePayload = {
            sendMfaCodeToEmail: 0,
            sendMfaCodeToPhone: 1,
            sendMfaCodeToAuthApp: 1,
            otp: '123456',
            userId: 0,
            userType: '',
        };

        await act(async () => {
            await result.current.handleUpdateSecurityInfo(payload);
        });

        await waitFor(() => {
            expect(updateSecurityInfo).toHaveBeenCalledWith(payload);
            expect(setData).toHaveBeenCalledWith({
                refresh: true,
                isEditLoading: false,
            });
            expect(showToast).not.toHaveBeenCalled();
        });
    });
});
