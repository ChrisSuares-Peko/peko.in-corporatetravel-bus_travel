import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { deleteDepartmentAPI } from '@src/domains/dashboard/Payroll/api/departmentApi/index'; // Mock this API
import { useDeleteDepartmentApi } from '@src/domains/dashboard/Payroll/hooks/departmentHooks/useDeleteDepartment'; // The hook
import { useAppSelector } from '@src/hooks/store';

// Mocking the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/departmentApi', () => ({
    deleteDepartmentAPI: vi.fn(),
}));

describe('useDeleteDepartmentApi hook', () => {
    const mockHandleCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call deleteDepartmentAPI and return true on success', async () => {
        // Mocking the API call to return a successful response
        const mockResponse = { success: true };
        (deleteDepartmentAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useDeleteDepartmentApi({ handleCancel: mockHandleCancel })
        );

        // Trigger the deleteDepartment function
        await act(async () => {
            const success = await result.current.deleteDepartment('department1');

            // Check if the API was called with the correct arguments
            expect(deleteDepartmentAPI).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                departmentId: 'department1',
            });

            // Expect the handleCancel to be called on success
            expect(mockHandleCancel).toHaveBeenCalled();

            // Expect the return value to be true since the API call was successful
            expect(success).toBe(true);

            // Ensure isLoading is handled properly
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should return false on API failure', async () => {
        // Mocking the API call to return false (failure)
        (deleteDepartmentAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() =>
            useDeleteDepartmentApi({ handleCancel: mockHandleCancel })
        );

        // Trigger the deleteDepartment function
        await act(async () => {
            const success = await result.current.deleteDepartment('department1');

            // Check if the API was called with the correct arguments
            expect(deleteDepartmentAPI).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                departmentId: 'department1',
            });

            // Expect handleCancel to NOT be called since the API failed
            expect(mockHandleCancel).not.toHaveBeenCalled();

            // Expect the return value to be false since the API call failed
            expect(success).toBe(false);

            // Ensure isLoading is handled properly
            expect(result.current.isLoading).toBe(false);
        });
    });
});
