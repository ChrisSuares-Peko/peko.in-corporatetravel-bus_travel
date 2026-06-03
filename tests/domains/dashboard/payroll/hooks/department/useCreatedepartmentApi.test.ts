import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { createDepartmentAPI } from '@src/domains/dashboard/Payroll/api/departmentApi/index'; // Mock this API
import { useCreateDepartmentApi } from '@src/domains/dashboard/Payroll/hooks/departmentHooks/useCreateDepartment'; // The hook you created
import { useAppSelector, useAppDispatch } from '@src/hooks/store';

// Mocking the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/departmentApi', () => ({
    createDepartmentAPI: vi.fn(),
}));

describe('useCreateDepartmentApi hook', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mock useAppDispatch to return mockDispatch
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create department and return true on success', async () => {
        // Mocking the API call to return a successful response
        const mockResponse = { departmentId: '1', name: 'HR' };
        (createDepartmentAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useCreateDepartmentApi());

        // Post data to simulate the API call
        const postData = { name: 'HR Department' };

        // Trigger the createDepartment function
        let success;
        await act(async () => {
            success = await result.current.createDepartment(postData);
        });

        // Check if the API was called with the correct arguments
        expect(createDepartmentAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            postData,
        });

        // Expect the return value to be true since the API call was successful
        expect(success).toBe(true);

        // Ensure isLoading is handled properly
        expect(result.current.isLoading).toBe(false);
    });

    it('should return false on API failure', async () => {
        // Mocking the API call to return false (failure)
        (createDepartmentAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useCreateDepartmentApi());

        // Post data to simulate the API call
        const postData = { name: 'Finance Department' };

        // Trigger the createDepartment function
        let success;
        await act(async () => {
            success = await result.current.createDepartment(postData);
        });

        // Check if the API was called with the correct arguments
        expect(createDepartmentAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            postData,
        });

        // Expect the return value to be false since the API call failed
        expect(success).toBe(false);

        // Ensure isLoading is handled properly
        expect(result.current.isLoading).toBe(false);
    });
});
