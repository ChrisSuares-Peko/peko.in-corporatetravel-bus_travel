import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { findOne } from '@domains/dashboard/Invoice/api';
import { GetSingleCustomer } from '@domains/dashboard/Invoice/hooks/useGetSingleCustomer';
import { getOneData } from '@domains/dashboard/Invoice/types/customertypes';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    findOne: vi.fn(),
}));

describe('GetSingleCustomer', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should fetch single customer data and update state on success', async () => {
        const mockResponse: getOneData = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
            address: '123 Main St',
            trnNo: '',
            createdAt: '',
            updatedAt: '',
            credentialId: 0,
            corporateUserId: 0,
            credential: {
                username: '',
                name: '',
            },
        };
        (findOne as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => GetSingleCustomer(1));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(findOne).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            id: 1,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.singleData).toEqual(mockResponse);
    });

    it('should handle API failure gracefully', async () => {
        (findOne as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetSingleCustomer(1));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(findOne).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            id: 1,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.singleData).toBeUndefined(); // Ensure singleData remains undefined on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse: getOneData = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
            address: '123 Main St',
            trnNo: '',
            createdAt: '',
            updatedAt: '',
            credentialId: 0,
            corporateUserId: 0,
            credential: {
                username: '',
                name: '',
            },
        };
        (findOne as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => GetSingleCustomer(1));

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(findOne).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            id: 1,
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.singleData).toEqual(mockResponse);
    });
});
