import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { getEmployeeListAPI } from '@src/domains/dashboard/Payroll/api/announcementApi';
import GetEmployeeList from '@src/domains/dashboard/Payroll/hooks/announcementHooks/useEmployeeListApi';
import { useAppSelector } from '@src/hooks/store';
import '@testing-library/jest-dom/vitest';

// Mocking the external dependencies
vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        useAppSelector: vi.fn(), // Mock useAppSelector
        useAppDispatch: vi.fn(), // Mock useAppDispatch if needed
    };
});

vi.mock('@src/domains/dashboard/Payroll/api/announcementApi', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        getEmployeeListAPI: vi.fn(), // Mock the getEmployeeListAPI call
    };
});

describe('GetEmployeeList hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch and set employee list successfully', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call
        const mockResponse = {
            employees: [
                {
                    fullName: 'John Doe',
                    id: 'emp123',
                },
                {
                    fullName: 'Jane Smith',
                    id: 'emp456',
                },
            ],
        };
        (getEmployeeListAPI as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => GetEmployeeList());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to finish loading and API to be called
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Asserting the correct API call is made
        expect(getEmployeeListAPI).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });

        // Checking if the employee data is formatted and set correctly
        expect(result.current.employeesData).toEqual([
            { key: 1, label: 'John Doe', value: 'emp123' },
            { key: 2, label: 'Jane Smith', value: 'emp456' },
        ]);

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set isLoading to false', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to return false (failure)
        (getEmployeeListAPI as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => GetEmployeeList());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to finish loading and API to be called
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Asserting the correct API call is made
        expect(getEmployeeListAPI).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
        });

        // Check that employeesData is undefined when the API fails
        expect(result.current.employeesData).toBeUndefined();

        // Asserting that loading has completed
        expect(result.current.isLoading).toBe(false);
    });
});
