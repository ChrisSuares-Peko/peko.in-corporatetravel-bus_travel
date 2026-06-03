// useGetBeneficiaries.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    AddBeneficiaryApi,
    updateBeneficiaryApi,
    deleteBeneficiaryApi,
    getBeneficiaryOtp,
    updateBeneficiaryStatusApi,
} from '../../../api/beneficiary';
import useGetBeneficiaries from '../../../hooks/beneficiary/useBeneficiaryApis';
import { setData } from '../../../slices/beneficiary';
import {
    addEditBeneficiaryPayload,
    deleteBeneficicaryPayload,
    updateBeneficiaryStatusPayload,
} from '../../../types';

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/hooks/store');
    return {
        ...actual,
        useAppDispatch: vi.fn(),
        useAppSelector: (selector: any) =>
            selector({
                reducer: {
                    auth: { role: 'admin', id: '123' },
                    beneficiary: { refresh: false, tableData: [], isLoading: false },
                },
            }),
    };
});

vi.mock('../../../api/beneficiary', () => ({
    AddBeneficiaryApi: vi.fn(),
    updateBeneficiaryApi: vi.fn(),
    deleteBeneficiaryApi: vi.fn(),
    getAllBeneficiaries: vi.fn(),
    getLastFiveBeneficiaries: vi.fn(),
    getBeneficiaryOtp: vi.fn(),
    updateBeneficiaryStatusApi: vi.fn(),
}));

vi.mock('../../../slices/beneficiary', () => ({
    setData: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useGetBeneficiaries', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    });
    it('should handle adding a beneficiary correctly', async () => {
        const payload: addEditBeneficiaryPayload = {
            userId: 123,
            userType: 'admin',
            accountNo: '1234567890',
            accessKey: 'some-access-key',
            isActive: true,
            credentialId: 'credential-id',
            otp: '123456',
            scope: 'some-scope',
        };

        (AddBeneficiaryApi as Mock).mockResolvedValue({
            status: true,
            message: 'Beneficiary added successfully',
        });
        const { result } = renderHook(() =>
            useGetBeneficiaries({
                accesskey: '',
                openOtpModal: vi.fn(),
                closeOtpModal: vi.fn(),
                closeAddModal: vi.fn(),
                closeConfirmationModal: vi.fn(),
            })
        );

        await act(async () => {
            await result.current.addBeneficiary(payload);
        });

        expect(AddBeneficiaryApi).toHaveBeenCalledWith(payload);
        expect(setData).toHaveBeenCalledWith({ refresh: true, isLoading: false });
        expect(showToast).toHaveBeenCalledWith({
            description: 'Beneficiary added successfully',
            variant: 'success',
        });
    });

    it('should handle updating a beneficiary correctly', async () => {
        const payload: addEditBeneficiaryPayload = {
            userId: 123,
            userType: 'admin',
            accountNo: '1234567890',
            accessKey: 'some-access-key',
            isActive: true,
            credentialId: 'credential-id',
            otp: '123456',
            scope: 'some-scope',
        };
        (updateBeneficiaryApi as Mock).mockResolvedValue({
            status: true,
            message: 'Beneficiary updated successfully',
        });
        const { result } = renderHook(() =>
            useGetBeneficiaries({
                accesskey: '',
                openOtpModal: vi.fn(),
                closeOtpModal: vi.fn(),
                closeAddModal: vi.fn(),
                closeConfirmationModal: vi.fn(),
            })
        );

        await act(async () => {
            await result.current.updateBeneficicary(payload);
        });

        expect(updateBeneficiaryApi).toHaveBeenCalledWith(payload);
        expect(setData).toHaveBeenCalledWith({ refresh: true, isLoading: false });
        expect(showToast).toHaveBeenCalledWith({
            description: 'Beneficiary updated successfully',
            variant: 'success',
        });
    });

    it('should handle deleting a beneficiary correctly', async () => {
        const payload: deleteBeneficicaryPayload = {
            userId: 123,
            userType: 'admin',
            id: 1,
            otp: '123456',
            scope: 'example-scope',
        };
        (deleteBeneficiaryApi as Mock).mockResolvedValue({ status: true });
        const { result } = renderHook(() =>
            useGetBeneficiaries({
                accesskey: '',
                openOtpModal: vi.fn(),
                closeOtpModal: vi.fn(),
                closeAddModal: vi.fn(),
                closeConfirmationModal: vi.fn(),
            })
        );

        const response = await act(async () => result.current.deleteBeneficicary(payload));

        expect(deleteBeneficiaryApi).toHaveBeenCalledWith(payload);
        expect(setData).toHaveBeenCalledWith({ refresh: true, isLoading: false });
        expect(showToast).toHaveBeenCalledWith({
            description: 'Beneficiary deleted successfully',
            variant: 'success',
        });
        expect(response).toBe(true);
    });

    it('should handle sending OTP correctly', async () => {
        const payload = {
            accountNo: '123',
            accessKey: 'key',
            beneficiaryId: 456,
        };
        const sentOtpPayload = {
            name: 'jhon doe',
            accountNo: '123',
            accessKey: 'key',
            beneficiaryId: 456,
        };

        (getBeneficiaryOtp as Mock).mockResolvedValue({ status: true });
        const { result } = renderHook(() =>
            useGetBeneficiaries({
                accesskey: '',
                openOtpModal: vi.fn(),
                closeOtpModal: vi.fn(),
                closeAddModal: vi.fn(),
                closeConfirmationModal: vi.fn(),
            })
        );

        await act(async () => {
            await result.current.sendOtpApi('add', sentOtpPayload);
        });

        expect(getBeneficiaryOtp).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            beneficiaryActionType: 'add',
            ...payload,
        });
    });

    it('should handle updating beneficiary status correctly', async () => {
        const payload: updateBeneficiaryStatusPayload = {
            userId: 123,
            userType: 'admin',
            isActive: true,
        };
        (updateBeneficiaryStatusApi as Mock).mockResolvedValue({ status: true });
        const { result } = renderHook(() =>
            useGetBeneficiaries({
                accesskey: '',
                openOtpModal: vi.fn(),
                closeOtpModal: vi.fn(),
                closeAddModal: vi.fn(),
                closeConfirmationModal: vi.fn(),
            })
        );

        const response = await act(async () => result.current.updateBeneficiaryStatus(payload));

        expect(updateBeneficiaryStatusApi).toHaveBeenCalledWith(payload);
        expect(response).toBe(true);
    });
});
