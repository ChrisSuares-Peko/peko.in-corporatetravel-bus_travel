import { renderHook, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { progress } from '@src/domains/dashboard/Payroll/api/dashBoardIndex';
import { useProgressApi } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useProgressApi';
import { setPayrollProgress } from '@src/domains/dashboard/Payroll/slices/payrollAuth';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock the external dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

// Correct the path of the progress API and ensure it's properly mocked
vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', () => ({
    progress: vi.fn(),
}));

vi.mock('@src/domains/dashboard/Payroll/slices/payrollAuth', () => ({
    setPayrollProgress: vi.fn(),
}));

describe('useProgressApi hook', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useAppSelector to return role and id
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mock useAppDispatch to return mockDispatch
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);

        // Mock useNavigate to return mockNavigate
        (useNavigate as Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch progress and dispatch setPayrollProgress on success', async () => {
        // Mocking the API call to return a successful response
        const mockProgressData = { progress: '50' }; // Replace with actual structure of progressResponse
        (progress as Mock).mockResolvedValue(mockProgressData); // Properly mock the API response

        const { result } = renderHook(() => useProgressApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to finish
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Verify the API call and dispatch were made correctly
        expect(progress).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });
        expect(mockDispatch).toHaveBeenCalledWith(setPayrollProgress(mockProgressData));
    });

    it('should navigate to serviceNotAvailable on API failure', async () => {
        // Mocking the API call to return false (failure)
        (progress as Mock).mockResolvedValue(false); // Properly mock the failed API response

        const { result } = renderHook(() => useProgressApi());

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for the hook to finish
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Verify the API call and navigation were made correctly
        expect(progress).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
        });
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.serviceNotAvailable);
    });
});
