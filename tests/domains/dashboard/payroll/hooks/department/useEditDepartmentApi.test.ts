import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { editDepartmentAPI } from '@src/domains/dashboard/Payroll/api/departmentApi'; // Mock this API
import { useEditDepartmentApi } from '@src/domains/dashboard/Payroll/hooks/departmentHooks/useEditDepartment'; // The hook
import { departmentEditPayload } from '@src/domains/dashboard/Payroll/types/departmentTypes/departmentTypes';
import { useAppSelector } from '@src/hooks/store';

// Mocking the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/departmentApi', () => ({
    editDepartmentAPI: vi.fn(),
}));

describe('useEditDepartmentApi hook', () => {
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

    it('should call editDepartmentAPI and return true on success', async () => {
        // Mocking the API call to return a successful response
        const mockResponse = { success: true };
        (editDepartmentAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useEditDepartmentApi());

        const mockPayload: departmentEditPayload = {
            id: '1',
            departmentName: 'Updated Department',
            departmentCode: 'DPT123', // Added departmentCode field
            description: 'Updated Description',
        };

        // Trigger the editDepartment function
        await act(async () => {
            const success = await result.current.editDepartment(mockPayload);

            // Check if the API was called with the correct arguments
            expect(editDepartmentAPI).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                id: '1',
                departmentName: 'Updated Department',
                departmentCode: 'DPT123', // Verify departmentCode is passed correctly
                description: 'Updated Description',
            });

            // Expect the return value to be true since the API call was successful
            expect(success).toBe(true);

            // Ensure isLoading is handled properly
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should return false when the API call fails', async () => {
        // Mocking the API call to return false (failure)
        (editDepartmentAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useEditDepartmentApi());

        const mockPayload: departmentEditPayload = {
            id: '1',
            departmentName: 'Failed Department Edit',
            departmentCode: 'DPT999', // Added departmentCode field
            description: 'Failed Description',
        };

        // Trigger the editDepartment function
        await act(async () => {
            const success = await result.current.editDepartment(mockPayload);

            // Check if the API was called with the correct arguments
            expect(editDepartmentAPI).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                id: '1',
                departmentName: 'Failed Department Edit',
                departmentCode: 'DPT999', // Verify departmentCode is passed correctly
                description: 'Failed Description',
            });

            // Expect the return value to be false since the API call failed
            expect(success).toBe(false);

            // Ensure isLoading is handled properly
            expect(result.current.isLoading).toBe(false);
        });
    });
});
