import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, beforeEach, afterEach, it, expect, Mock, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import { getEmployees } from '../../api/index';
import { useGetEmployee } from '../../hooks/useGetEmployeeApi';
import { employeeTypes } from '../../types/employee';

// Mock the API and state selector
vi.mock('../../api/index');
vi.mock('@src/hooks/store');

describe('useGetEmployee Hook', () => {
    const mockEmployees: employeeTypes[] = [
        {
            id: '1',
            fullName: 'John Doe',
            personalEmail: 'john.doe@example.com',
            employeeInformation: {
                employeeId: 'EMP001',
            },
            value: '',
            label: '',
        },
        {
            id: '2',
            fullName: 'Jane Smith',
            personalEmail: 'jane.smith@example.com',
            employeeInformation: {
                employeeId: 'EMP002',
            },
            value: '',
            label: '',
        },
    ];

    beforeEach(() => {
        // Mock useAppSelector to return user details
        (useAppSelector as Mock).mockReturnValue({ role: 'admin', id: '123' });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with empty employees array', () => {
        const { result } = renderHook(() => useGetEmployee(false));

        expect(result.current.data).toEqual([]);
        expect(result.current.generateEmployeesDropdown).toBeDefined();
    });

    it('should fetch and update employees data on mount', async () => {
        (getEmployees as Mock).mockResolvedValue({ employees: mockEmployees });

        const { result } = renderHook(() => useGetEmployee(true));

        await waitFor(() => {
            expect(getEmployees).toHaveBeenCalledWith({ userId: '123', userType: 'admin' });
            expect(result.current.data).toEqual(mockEmployees);
        });
    });

    it('should handle API call failure gracefully', async () => {
        (getEmployees as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useGetEmployee(true));

        await waitFor(() => {
            expect(result.current.data).toEqual([]);
        });
    });

    it('should generate employees dropdown correctly', () => {
        const { result } = renderHook(() => useGetEmployee(true));

        act(() => {
            result.current.generateEmployeesDropdown(mockEmployees);
        });

        const dropdown = result.current.generateEmployeesDropdown(mockEmployees);

        expect(dropdown).toEqual([
            {
                fullName: 'John Doe',
                value: '1',
                label: 'EMP001 - John Doe',
                personalEmail: 'john.doe@example.com',
            },
            {
                fullName: 'Jane Smith',
                value: '2',
                label: 'EMP002 - Jane Smith',
                personalEmail: 'jane.smith@example.com',
            },
        ]);
    });

    it('should re-fetch employees data when dependencies change', async () => {
        (getEmployees as Mock).mockResolvedValue({ employees: mockEmployees });

        const { result, rerender } = renderHook(() => useGetEmployee(true));

        await waitFor(() => {
            expect(result.current.data).toEqual(mockEmployees);
        });

        // Mock useAppSelector to return updated user details
        (useAppSelector as Mock).mockReturnValue({ role: 'manager', id: '456' });

        rerender();

        await waitFor(() => {
            expect(getEmployees).toHaveBeenCalledTimes(2);
            expect(getEmployees).toHaveBeenCalledWith({ userId: '456', userType: 'manager' });
        });
    });
});
