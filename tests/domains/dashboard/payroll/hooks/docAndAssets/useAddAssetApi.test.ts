import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { createAsset } from '@src/domains/dashboard/Payroll/api/docAndAssetsApi';
import useAssetCreate from '@src/domains/dashboard/Payroll/hooks/docAndAssetsHooks/useAddAssetApi';
import {
    assetResponse,
    createAssetPayload,
    UserPayload,
} from '@src/domains/dashboard/Payroll/types/docAndAssetsTypes';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mocking external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/docAndAssetsApi', () => ({
    createAsset: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useAssetCreate hook', () => {
    const mockDispatch = vi.fn();
    const mockHandleCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mocking useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking useAppDispatch to return mockDispatch
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create asset and show toast on success', async () => {
        // Mocking the API call to return a successful response
        const mockAssetResponse: assetResponse = {
            assetId: '1',
            assetName: 'Test Asset',
            corporateUser: 'Corporate User',
            purchasedDate: '2024-09-20',
            assetType: 'Type',
            status: 'Active',
            employee: 'Employee Name',
            batchNo: 'Batch123',
            createdAt: '2024-09-10',
            updatedAt: '2024-09-15',
            id: '1',
        };
        (createAsset as Mock).mockResolvedValue(mockAssetResponse);

        const { result } = renderHook(() => useAssetCreate(mockHandleCancel));

        // Adjust the mock payload to match the expected values in the API call
        const mockPayload: createAssetPayload & UserPayload = {
            assetName: 'Test Asset',
            assetType: 'Type',
            purchasedDate: '2024-09-20',
            status: 'Active',
            assetId: '1',
            employee: 'Employee Name',
            batchNo: 'Batch123',
            userId: 123,
            userType: 'admin',
        };

        // Trigger the handleAssetCreation function
        await act(async () => {
            await result.current.handleAssetCreation(mockPayload);
        });

        // Check if the API was called with the correct arguments
        expect(createAsset).toHaveBeenCalledWith({
            assetName: 'Test Asset',
            assetType: 'Type',
            purchasedDate: '2024-09-20',
            status: 'Active',
            assetId: '1',
            employee: 'Employee Name',
            batchNo: 'Batch123',
            userId: '123',
            userType: 'admin',
        });

        // Verify that the showToast was dispatched
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Asset added succesfully',
                variant: 'success',
            })
        );

        // Check if the handleCancel function was called
        expect(mockHandleCancel).toHaveBeenCalled();

        // Ensure the response data is updated
        expect(result.current.responseData).toEqual(mockAssetResponse);
    });
});
