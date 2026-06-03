import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getCompanyInfo, updateCompanyInfo } from '@src/domains/dashboard/profile/api/companyInfo';
import useCompanyInfoApi from '@src/domains/dashboard/profile/hooks/useCompanyInfoApi';
import { setData } from '@src/domains/dashboard/profile/slices/companyInfo';
import {
    CompanyInfoResponse,
    UpdateBasicInfoResponse,
    UpdateCompanyInfoRequestPayload,
} from '@src/domains/dashboard/profile/types';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));
vi.mock('@src/domains/dashboard/profile/api/companyInfo', () => ({
    getCompanyInfo: vi.fn(),
    updateCompanyInfo: vi.fn(),
}));
vi.mock('@src/domains/dashboard/profile/slices/companyInfo', () => ({
    setData: vi.fn(),
}));

describe('useCompanyInfoApi', () => {
    const mockDispatch = vi.fn();
    const mockState = {
        reducer: {
            auth: { role: 'user', id: '123' },
            companyInfo: {
                refresh: false,
                data: null,
                isLoading: false,
                isEditLoading: false,
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

    it('should fetch company info on mount', async () => {
        const mockResponse: CompanyInfoResponse = {
            activity: 'Activity',
            trnExpiry: '2025-12-31',
            trnNo: 'TRN123',
            tradeLicenseExpiry: '2025-12-31',
            tradeLicenseNo: 'TL123',
            tradeLicenseDoc: 'doc',
            trnCertificate: 'cert',
            eidDoc: 'eid',
        };

        (getCompanyInfo as any).mockResolvedValue(mockResponse);

        renderHook(() => useCompanyInfoApi({}));

        await waitFor(() => {
            expect(getCompanyInfo).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ data: mockResponse, isLoading: false })
            );
        });
    });

    it('should handle updating company info', async () => {
        const mockResponse: UpdateBasicInfoResponse = {
            result: 'success',
            docs: { logo: 'new-logo.png' },
        };

        const payload: UpdateCompanyInfoRequestPayload = {
            activity: 'Activity',
            cinNumber: 'CIN123',
            gstNumber: 'GST123',
            panNumber: 'PAN123',
            cinDoc: 'doc',
            gstDoc: 'doc',
            panDoc: 'doc',
            cinFormat: 'pdf',
            gstFormat: 'pdf',
            panFormat: 'pdf',
            scope: 'scope',
            otp: '123456',
            userId: 123,
            userType: 'user',
        };

        (updateCompanyInfo as any).mockResolvedValue(mockResponse);

        const handleCancel = vi.fn();
        const handleOtpClose = vi.fn();

        const { result } = renderHook(() => useCompanyInfoApi({ handleCancel, handleOtpClose }));

        await act(async () => {
            await result.current.handleUpdateCompanyInfo(payload);
        });

        await waitFor(() => {
            expect(updateCompanyInfo).toHaveBeenCalledWith(payload);
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ refresh: true, isLoading: false, isEditLoading: false })
            );
            expect(showToast).toHaveBeenCalledWith({
                description: 'Company info updated successfully',
                variant: 'success',
            });
            expect(handleOtpClose).toHaveBeenCalled();
            expect(handleCancel).toHaveBeenCalled();
        });
    });

    it('should handle update company info failure', async () => {
        (updateCompanyInfo as any).mockResolvedValue(false);

        const handleCancel = vi.fn();
        const { result } = renderHook(() => useCompanyInfoApi({ handleCancel }));

        await act(async () => {
            await result.current.handleUpdateCompanyInfo({
                activity: 'Activity',
                cinNumber: 'CIN123',
                gstNumber: 'GST123',
                panNumber: 'PAN123',
                cinDoc: 'doc',
                gstDoc: 'doc',
                panDoc: 'doc',
                cinFormat: 'pdf',
                gstFormat: 'pdf',
                panFormat: 'pdf',
                scope: 'scope',
                otp: '123456',
                userId: 123,
                userType: 'user',
            });
        });

        await waitFor(() => {
            expect(updateCompanyInfo).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isEditLoading: false }));
            expect(handleCancel).not.toHaveBeenCalled();
        });
    });
});
