import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, Mock, expect } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getAllBeneficiaries, getLastFiveBeneficiaries } from '../../../api/beneficiary';
import useGetBeneficiary from '../../../hooks/beneficiary/useFetchBeneficiary';

// Mock the API functions
vi.mock('../../../api/beneficiary', () => ({
    getAllBeneficiaries: vi.fn(),
    getLastFiveBeneficiaries: vi.fn(),
}));

// Mock the Redux hooks
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

describe('useGetBeneficiary', () => {
    const mockDispatch = vi.fn();

    // Ensure the correct types are used for the mocks
    const mockUseAppSelector = useAppSelector as unknown as Mock;
    const mockUseAppDispatch = useAppDispatch as unknown as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppDispatch.mockReturnValue(mockDispatch);
    });

    it('should initialize with default states', () => {
        mockUseAppSelector.mockReturnValue({ tableData: [], isLoading: true });

        const { result } = renderHook(() => useGetBeneficiary({ accesskey: '' }));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.tableData).toEqual([]);
    });

    it('should call getLastFiveBeneficiaries API and update state on success when accesskey is not provided', async () => {
        const mockResponse = {
            data: [
                { id: 1, name: 'Beneficiary 1' },
                { id: 2, name: 'Beneficiary 2' },
            ],
        };
        (getLastFiveBeneficiaries as any).mockResolvedValueOnce(mockResponse);

        mockUseAppSelector.mockReturnValue({ tableData: mockResponse.data, isLoading: false });

        const { result } = renderHook(() => useGetBeneficiary({ accesskey: '' }));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.tableData).toEqual(mockResponse.data);
        });

        expect(getLastFiveBeneficiaries).not.toHaveBeenCalledWith();
    });

    it('should call getAllBeneficiaries API and update state on success when accesskey is provided', async () => {
        const mockResponse = {
            data: [{ id: 1, name: 'Beneficiary 1' }],
        };
        (getAllBeneficiaries as any).mockResolvedValueOnce(mockResponse);

        mockUseAppSelector.mockReturnValue({ tableData: mockResponse.data, isLoading: false });

        const { result } = renderHook(() => useGetBeneficiary({ accesskey: 'someAccessKey' }));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.tableData).toEqual(mockResponse.data);
        });

        expect(getAllBeneficiaries).not.toHaveBeenCalledWith();
    });

    it('should handle API failure and set tableData to empty array', async () => {
        (getLastFiveBeneficiaries as any).mockResolvedValueOnce(false);

        mockUseAppSelector.mockReturnValue({ tableData: [], isLoading: false });

        const { result } = renderHook(() => useGetBeneficiary({ accesskey: '' }));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.tableData).toEqual([]);
        });
    });

    it('should set isLoading to true during API call', async () => {
        (getLastFiveBeneficiaries as any).mockImplementation(() => new Promise(() => {}));

        mockUseAppSelector.mockReturnValue({ tableData: [], isLoading: true });

        const { result } = renderHook(() => useGetBeneficiary({ accesskey: '' }));

        expect(result.current.isLoading).toBe(true);
    });

    it('should re-fetch data when accesskey changes', async () => {
        const mockResponse1 = {
            data: [{ id: 1, name: 'Beneficiary 1' }],
        };
        const mockResponse2 = {
            data: [{ id: 2, name: 'Beneficiary 2' }],
        };

        (getLastFiveBeneficiaries as any)
            .mockResolvedValueOnce(mockResponse1)
            .mockResolvedValueOnce(mockResponse2);

        mockUseAppSelector.mockReturnValue({ tableData: mockResponse1.data, isLoading: false });

        const { result, rerender } = renderHook(
            ({ accesskey }) => useGetBeneficiary({ accesskey }),
            {
                initialProps: { accesskey: '' },
            }
        );

        await waitFor(() => {
            expect(result.current.tableData).toEqual(mockResponse1.data);
        });

        rerender({ accesskey: 'newAccessKey' });
    });
});
