import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    BulkExcelTemplateApi,
    BulkExcelUploadApi,
    BulkCreateApi,
    getBulkBeneficiaryOtp,
} from '../../../api/etisalat';
import useEtiSalatBulkUpload from '../../../hooks/beneficiary/useBeneficiaryBulkUpload';
import { setBulkData, resetData } from '../../../slices/beneficiary';
import { GetLimitResponse } from '../../../types';

// Mock the necessary modules and functions
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as typeof import('@src/hooks/store');
    return {
        ...actual,
        useAppDispatch: vi.fn(),
        useAppSelector: (selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'admin',
                        id: 123,
                    },
                },
            }),
    };
});

vi.mock('../../../api/etisalat', () => ({
    BulkExcelTemplateApi: vi.fn(),
    BulkExcelUploadApi: vi.fn(),
    BulkCreateApi: vi.fn(),
    getBulkBeneficiaryOtp: vi.fn(),
}));

vi.mock('../../../slices/beneficiary', () => ({
    setBulkData: vi.fn(),
    resetData: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useEtiSalatBulkUpload', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockUserId = 123; // Update to a number

    const mockLimitData: GetLimitResponse = {
        minDenomination: 100,
        maxDenomination: 10000,
        flexiKey: 'flexi-key',
        typeKey: 1,
        accessKey: 'access-key',
        serviceProvider: 'service-provider',
        surcharge: 'surcharge',
    };

    beforeEach(() => {
        (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
        (useAppDispatch as unknown as Mock).mockReturnValue(mockDispatch);

        vi.clearAllMocks();
    });

    it('should produce template link', async () => {
        const mockTemplateUrl = 'http://example.com/template.xlsx';
        (BulkExcelTemplateApi as Mock).mockResolvedValue({
            productsTemplateUrl: mockTemplateUrl,
        });

        const { result } = renderHook(() =>
            useEtiSalatBulkUpload({
                openOtpModal: undefined,
                closeOtpModal: undefined,
                limitData: mockLimitData,
                serviceData: { accessKey: 'service-key', url: 'service-url' },
            })
        );

        await act(async () => {
            await result.current.getetiSalatBulkUploadTemplate();
        });

        expect(BulkExcelTemplateApi).toHaveBeenCalledWith({
            userId: mockUserId, // Ensure this matches the mock value
            userType: 'admin', // Ensure this matches the mock value
            accessKey: 'service-key',
        });
    });

    it('should handle bulk upload successfully', async () => {
        const mockFile = new File([], 'test.xlsx');
        const mockResponse = {
            jsonData: [
                {
                    name: 'John Doe',
                    accountNo: '123456',
                    optional1: 'Optional Data',
                    credentialId: 12345, // Change to number
                    status: true,
                    errors: [], // Assuming errors can be an empty array
                },
            ],
        };

        (BulkExcelUploadApi as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useEtiSalatBulkUpload({
                openOtpModal: undefined,
                closeOtpModal: undefined,
                limitData: mockLimitData,
                serviceData: { accessKey: 'service-key', url: 'service-url' },
            })
        );

        await act(async () => {
            await result.current.BulkUpload(mockFile);
        });

        expect(BulkExcelUploadApi).toHaveBeenCalledWith({
            userId: mockUserId,
            userType: 'admin',
            file: mockFile,
            accessKey: 'access-key',
            flexiKey: 'flexi-key',
            typeKey: 1,
        });
        expect(mockDispatch).toHaveBeenCalledWith(setBulkData(mockResponse.jsonData));
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                variant: 'success',
                description: 'Please review the etiSalat PostPaid Data',
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith(`/bill-payments/service-url/bulkupload`);
    });

    it('should handle bulk create successfully', async () => {
        const mockPayload = { some: 'data' };
        const mockResponse = { status: true };
        (BulkCreateApi as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useEtiSalatBulkUpload({
                openOtpModal: undefined,
                closeOtpModal: undefined,
                limitData: mockLimitData,
                serviceData: { accessKey: 'service-key', url: 'service-url' },
            })
        );

        await act(async () => {
            await result.current.BulkCreate(mockPayload);
        });

        expect(BulkCreateApi).toHaveBeenCalledWith({
            ...mockPayload,
            userId: mockUserId,
            userType: 'admin',
        });
        expect(mockDispatch).toHaveBeenCalledWith(resetData());
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                variant: 'success',
                description: 'Postpaid Benificiaries created successfully',
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/bill-payments/service-url');
    });

    it('should handle OTP sending successfully', async () => {
        (getBulkBeneficiaryOtp as Mock).mockResolvedValue({ status: true });

        const { result } = renderHook(() =>
            useEtiSalatBulkUpload({
                openOtpModal: vi.fn(),
                closeOtpModal: undefined,
                limitData: mockLimitData,
                serviceData: { accessKey: 'service-key', url: 'service-url' },
            })
        );

        await act(async () => {
            await result.current.sendBulkOtpApi();
        });

        expect(getBulkBeneficiaryOtp).toHaveBeenCalledWith({
            userId: mockUserId,
            userType: 'admin',
        });
        expect(getBulkBeneficiaryOtp).toHaveBeenCalled(); // Ensure this matches the API call
    });

    it('should handle API errors and show error messages', async () => {
        (BulkExcelUploadApi as Mock).mockResolvedValue(false);

        const { result } = renderHook(() =>
            useEtiSalatBulkUpload({
                openOtpModal: undefined,
                closeOtpModal: undefined,
                limitData: mockLimitData,
                serviceData: { accessKey: 'service-key', url: 'service-url' },
            })
        );

        await act(async () => {
            await result.current.BulkUpload(new File([], 'test.xlsx'));
        });

        expect(BulkExcelUploadApi).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                variant: 'error',
                description: 'Bulk upload failed. Please try again',
            })
        );
    });
});
