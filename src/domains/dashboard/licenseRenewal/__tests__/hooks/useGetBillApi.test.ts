import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getBillDetails, getLimit } from '../../api';
import { useGetBillApi } from '../../hooks/useGetBillApi';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../api', () => ({
    getBillDetails: vi.fn(),
    getLimit: vi.fn(),
}));

describe('useGetBillApi', () => {
    const navigate = vi.fn();
    const mockUser = {
        role: 'user',
        id: '1',
    };

    beforeEach(() => {
        (useNavigate as Mock).mockReturnValue(navigate);
        (useAppSelector as Mock).mockReturnValue(mockUser);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch limit and balance, then navigate to the details page', async () => {
        const mockLimitResponse = {
            status: true,
            data: {
                flexiKey: 'testFlexiKey',
                typeKey: 'testTypeKey',
            },
        };
        const mockBalanceResponse = {
            status: true,
            data: {
                balance: '100',
            },
        };

        (getLimit as Mock).mockResolvedValue(mockLimitResponse);
        (getBillDetails as Mock).mockResolvedValue(mockBalanceResponse);

        const { result } = renderHook(() => useGetBillApi());

        await act(async () => {
            await result.current.getBalance({ voucherId: 'testVoucherId' });
        });

        expect(getLimit).toHaveBeenCalledWith({
            userId: mockUser.id,
            userType: mockUser.role,
        });
        expect(getBillDetails).toHaveBeenCalledWith({
            userId: mockUser.id,
            userType: mockUser.role,
            voucherId: 'testVoucherId',
            flexiKey: mockLimitResponse.data.flexiKey,
            typeKey: mockLimitResponse.data.typeKey,
        });
        expect(navigate).toHaveBeenCalledWith(paths.licenseRenewal.details, {
            state: {
                ...mockLimitResponse.data,
                ...mockBalanceResponse.data,
            },
        });
    });

    it('should handle API failure and not navigate', async () => {
        (getLimit as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useGetBillApi());

        await act(async () => {
            await result.current.getBalance({ voucherId: 'testVoucherId' });
        });

        expect(getLimit).toHaveBeenCalled();
        expect(getBillDetails).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('should set isLoading state correctly during API calls', async () => {
        const mockLimitResponse = {
            status: true,
            data: {
                flexiKey: 'testFlexiKey',
                typeKey: 'testTypeKey',
            },
        };
        const mockBalanceResponse = {
            status: true,
            data: {
                balance: '100',
            },
        };

        (getLimit as Mock).mockResolvedValue(mockLimitResponse);
        (getBillDetails as Mock).mockResolvedValue(mockBalanceResponse);

        const { result } = renderHook(() => useGetBillApi());

        // Initially, isLoading should be false
        expect(result.current.isLoading).toBe(false);

        await act(async () => {
            const promise = result.current.getBalance({ voucherId: 'testVoucherId' });

            await promise;
        });

        // After the API call is resolved, isLoading should be false again
        expect(result.current.isLoading).toBe(false);
    });
});
