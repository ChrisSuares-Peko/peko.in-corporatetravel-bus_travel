import { renderHook, act } from '@testing-library/react';
import moment from 'moment';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { listDepartmentAPI } from '@src/domains/dashboard/Payroll/api/departmentApi'; // Mock this API
import { useGetDepartmentList } from '@src/domains/dashboard/Payroll/hooks/departmentHooks/useGetDepartmentList'; // The hook you created
import { departmentListing } from '@src/domains/dashboard/Payroll/types/departmentTypes/departmentTypes';
import { useAppSelector } from '@src/hooks/store';

// Mocking the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/api/departmentApi', () => ({
    listDepartmentAPI: vi.fn(),
}));

describe('useGetDepartmentList hook', () => {
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

    it('should fetch department list and update state on success', async () => {
        // Mocking the API call to return a successful response
        const mockResponse: departmentListing = {
            totalCount: 2,
            departmentData: [
                {
                    departmentName: 'HR',
                    departmentCode: 'HR001',
                    description: 'Human Resources Department',
                    createdAt: new Date('2024-09-20'),
                    updatedAt: new Date('2024-09-21'), // Add updatedAt
                    corporateUser: 1, // Add corporateUser
                    id: '1',
                },
                {
                    departmentName: 'Finance',
                    departmentCode: 'FIN002',
                    description: 'Finance Department',
                    createdAt: new Date('2024-09-22'),
                    updatedAt: new Date('2024-09-23'), // Add updatedAt
                    corporateUser: 1, // Add corporateUser
                    id: '2',
                },
            ],
        };
        (listDepartmentAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetDepartmentList(null, 1, 10));

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Trigger the hook and wait for the API call
        await act(async () => {
            await result.current.refetch();
        });

        // Expect loading to be false after the API call
        expect(result.current.isLoading).toBe(false);

        // Check if the API was called with correct arguments
        expect(listDepartmentAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            postData: {
                searchKey: null,
                page: 1,
                limit: 10,
            },
        });

        // Verify the state has been updated correctly
        expect(result.current.count).toBe(2);
        expect(result.current.departmentCount).toBe(2);
        expect(result.current.tableData).toEqual([
            {
                key: 0,
                date: moment(new Date('2024-09-20')).format('DD-MM-YYYY'),
                name: 'HR',
                code: 'HR001',
                description: 'Human Resources Department',
                id: '1',
            },
            {
                key: 1,
                date: moment(new Date('2024-09-22')).format('DD-MM-YYYY'),
                name: 'Finance',
                code: 'FIN002',
                description: 'Finance Department',
                id: '2',
            },
        ]);
    });

    it('should handle API failure gracefully', async () => {
        // Mocking the API call to return false (failure)
        (listDepartmentAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useGetDepartmentList(null, 1, 10));

        // Trigger the hook and wait for the API call
        await act(async () => {
            await result.current.refetch();
        });

        // Expect loading to be false after the API call
        expect(result.current.isLoading).toBe(false);

        // Verify that table data and count are not updated on failure
        expect(result.current.tableData).toEqual([]);
        expect(result.current.count).toBe(0);
        expect(result.current.departmentCount).toBe(0);
    });
});
