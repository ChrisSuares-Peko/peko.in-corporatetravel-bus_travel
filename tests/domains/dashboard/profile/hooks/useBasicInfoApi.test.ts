import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import {
    changePassword,
    getBasicInfo,
    updateBasicInfo,
} from '@src/domains/dashboard/profile/api/basicInfo';
import useBasicInfoApi from '@src/domains/dashboard/profile/hooks/useBasicInfoApi';
import { setData } from '@src/domains/dashboard/profile/slices/basicInfo';
import {
    BasicInfoResponse,
    Package,
    Credential,
    ChangePasswordRequestPayload,
    UpdateBasicInfoRequestPayload,
    UpdateBasicInfoResponse,
} from '@src/domains/dashboard/profile/types';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', async importOriginal => {
    const actual =
        await vi.importActual<typeof import('@src/slices/apiSlice')>('@src/slices/apiSlice');
    return {
        ...actual,
        showToast: vi.fn(),
    };
});

vi.mock('@src/slices/userSlice', async importOriginal => {
    const actual =
        await vi.importActual<typeof import('@src/slices/userSlice')>('@src/slices/userSlice');
    return {
        ...actual,
        setUserInfo: vi.fn(),
    };
});

vi.mock('@src/domains/dashboard/profile/api/basicInfo', async importOriginal => {
    const actual = await vi.importActual<
        typeof import('@src/domains/dashboard/profile/api/basicInfo')
    >('@src/domains/dashboard/profile/api/basicInfo');
    return {
        ...actual,
        changePassword: vi.fn(),
        getBasicInfo: vi.fn(),
        updateBasicInfo: vi.fn(),
    };
});

vi.mock('@src/domains/dashboard/profile/slices/basicInfo', async importOriginal => {
    const actual = await vi.importActual<
        typeof import('@src/domains/dashboard/profile/slices/basicInfo')
    >('@src/domains/dashboard/profile/slices/basicInfo');
    return {
        ...actual,
        setData: vi.fn(),
    };
});

describe('useBasicInfoApi', () => {
    const mockDispatch = vi.fn();
    const mockState = {
        reducer: {
            auth: {
                role: 'user',
                id: '123',
                refresh: false,
                data: null,
                isLoading: false,
                isEditLoading: false,
            },
            basicInfo: {
                role: 'user',
                id: '123',
                refresh: false,
                data: null,
                isLoading: false,
                isEditLoading: false,
            },
            user: {
                logo: 'old-logo.png',
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: (state: typeof mockState) => any) =>
            selector(mockState)
        );
    });

    it('should fetch user basic info on mount', async () => {
        const mockResponse: BasicInfoResponse = {
            name: 'John Doe',
            mobileNo: '1234567890',
            city: 'New York',
            designation: 'Developer',
            email: 'john.doe@example.com',
            country: 'USA',
            contactPersonName: 'Jane Doe',
            companySize: 'Medium',
            landlineNo: '9876543210',
            mobileVerified: 1,
            logo: 'logo.png',
            package: {
                packageName: 'Standard Package',
            } as Package,
            credential: {
                username: 'john_doe',
            } as Credential,
        };
        (getBasicInfo as any).mockResolvedValue(mockResponse);

        renderHook(() => useBasicInfoApi({}));

        await waitFor(() => {
            expect(getBasicInfo).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ data: mockResponse, isLoading: false })
            );
        });
    });

    it('should handle updating basic info', async () => {
        const mockResponse: UpdateBasicInfoResponse = {
            result: 'success',
            docs: { logo: 'new-logo.png' },
        };
        const payload: UpdateBasicInfoRequestPayload = {
            name: 'John Doe',
            mobileNo: '1234567890',
            city: 'New York',
            designation: 'Developer',
            email: 'john.doe@example.com',
            country: 'USA',
            companyName: 'Example Corp',
            companySize: 'Medium',
            landlineNo: '9876543210',
            profileImageBase: 'base64string',
            profileImageFormat: 'png',
            scope: 'some scope',
            otp: '123456',
            userId: 0,
            userType: '',
        };
        (updateBasicInfo as any).mockResolvedValue(mockResponse);

        const handleCancel = vi.fn();
        const handleOtpClose = vi.fn();

        const { result } = renderHook(() => useBasicInfoApi({ handleCancel, handleOtpClose }));

        await act(async () => {
            await result.current.handleUpdateBasicInfo(payload);
        });

        await waitFor(() => {
            expect(updateBasicInfo).toHaveBeenCalledWith(payload);
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ refresh: true, isLoading: false, isEditLoading: false })
            );
            expect(showToast).toHaveBeenCalledWith({
                description: 'Basic info updated successfully',
                variant: 'success',
            });
            expect(handleOtpClose).toHaveBeenCalled();
            expect(handleCancel).toHaveBeenCalled();
        });
    });

    it('should handle change user password', async () => {
        const payload: ChangePasswordRequestPayload = {
            oldPassword: 'oldpass',
            newPassword: 'newpass',
            userId: 0,
            userType: '',
        };
        (changePassword as any).mockResolvedValue(true);

        const handleCancel = vi.fn();

        const { result } = renderHook(() => useBasicInfoApi({ handleCancel }));

        await act(async () => {
            const success = await result.current.handleChangeUserPassword(payload);
            expect(success).toBe(true);
        });

        await waitFor(() => {
            expect(changePassword).toHaveBeenCalledWith(payload);
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isEditLoading: false }));
            expect(showToast).toHaveBeenCalledWith({
                description: 'Password changed successfully',
                variant: 'success',
            });
            expect(handleCancel).toHaveBeenCalled();
        });
    });

    it('should handle change user password failure', async () => {
        const payload: ChangePasswordRequestPayload = {
            oldPassword: 'oldpass',
            newPassword: 'newpass',
            userId: 0,
            userType: '',
        };
        (changePassword as any).mockResolvedValue(false);

        const handleCancel = vi.fn();

        const { result } = renderHook(() => useBasicInfoApi({ handleCancel }));

        const success = await result.current.handleChangeUserPassword(payload);

        await waitFor(() => {
            expect(success).toBe(false);
            expect(changePassword).toHaveBeenCalledWith(payload);
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isEditLoading: false }));
            expect(handleCancel).not.toHaveBeenCalled();
        });
    });
});
