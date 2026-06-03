import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { showToast } from '@src/slices/apiSlice';

import { getBulkBalance } from '../../../api/bulkPayment';
import useBulkPayment from '../../../hooks/beneficiary/useBulkPayApis';
import { setData } from '../../../slices/beneficiary';
import { GetLimitResponse } from '../../../types';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('../../../api/bulkPayment', () => ({
    getBulkBalance: vi.fn(),
}));

vi.mock('../../../slices/beneficiary', () => ({
    setData: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useBulkPayment', () => {
    const navigate = vi.fn();
    const dispatch = vi.fn();
    const mockLimitDetails: GetLimitResponse = {
        minDenomination: 50,
        maxDenomination: 150,
        flexiKey: 'flexiKeyValue',
        typeKey: 1,
        accessKey: 'accessKeyValue',
        serviceProvider: 'serviceProviderValue',
        surcharge: 'surchargeValue',
    };

    const mockBulkBalanceData = {
        beneficiariesBalances: [
            {
                data: {
                    CurrentBalance: '1000.00',
                    ProviderTransactionId: 'providerTxn123',
                    ReplyDateStamp: '2024-08-01T00:00:00Z',
                    ResponseCode: '200',
                    ResponseMessage: 'Success',
                    ServiceType: 'Service A',
                    TransactionDateStamp: '2024-08-01T00:00:00Z',
                    TransactionType: 'Credit',
                    accountNo: '123456789',
                    dueBalanceInAed: '100.00',
                    id: 1,
                    name: 'Beneficiary 1',
                    optional1: 'Optional 1',
                    status: 'Active',
                    surchargeInAED: '0.00',
                },
                key: 1,
                message: 'Beneficiary 1 selected',
                status: true,
            },
        ],
    };

    beforeEach(() => {
        (useAppSelector as Mock).mockImplementation(callback =>
            callback({
                reducer: {
                    auth: { role: 'user', id: '123' },
                    beneficiary: { bulkBalanceData: mockBulkBalanceData.beneficiariesBalances },
                    billPayment: { vendor: { accessKey: 'accessKeyValue' } },
                },
            })
        );

        (useNavigate as Mock).mockReturnValue(navigate);
        (useAppDispatch as Mock).mockReturnValue(dispatch);
        (getBulkBalance as Mock).mockResolvedValue(mockBulkBalanceData);
        (getSurcharge as Mock).mockResolvedValue({ surcharge: '10', corporateCashback: '5' });
    });

    it('should show a warning if no beneficiaries are selected in bulkBalanceApi', async () => {
        const { result } = renderHook(() => useBulkPayment({ limitDetails: mockLimitDetails }));

        await act(async () => {
            await result.current.bulkBalanceApi([], mockLimitDetails);
        });

        expect(showToast).toHaveBeenCalledWith({
            variant: 'warning',
            description: 'Please select at least one beneficiary to continue',
        });
    });

    it('should fetch bulk balance data and navigate when beneficiaries are selected', async () => {
        const { result } = renderHook(() => useBulkPayment({ limitDetails: mockLimitDetails }));

        await act(async () => {
            await result.current.bulkBalanceApi([1], mockLimitDetails);
        });

        // Assert setData is called with the correct data
        expect(setData).toHaveBeenCalledWith({
            bulkBalanceData: mockBulkBalanceData.beneficiariesBalances,
        });

        // Assert navigate is called with the correct path
        expect(navigate).toHaveBeenCalledWith(paths.billPayments.bulkPayment);
    });

    it('should show warnings for invalid or too many selected rows in bulkPaymentApi', async () => {
        const { result } = renderHook(() => useBulkPayment({ limitDetails: mockLimitDetails }));

        await act(async () => {
            await result.current.bulkPaymentApi(1000, { 1: 100 }, [], { 1: true });
        });

        expect(showToast).toHaveBeenCalledWith({
            variant: 'warning',
            description: 'Please select at least one beneficiary to continue',
        });

        await act(async () => {
            await result.current.bulkPaymentApi(
                1000,
                { 1: 100 },
                Array.from({ length: 1001 }, (_, i) => i + 1),
                { 1: true }
            );
        });

        expect(showToast).toHaveBeenCalledWith({
            variant: 'warning',
            description:
                'You can only process up to 1000 payments at a time. Please reduce the number of payments and try again.',
        });
    });

    it('should handle valid bulk payment and navigate to payments page', async () => {
        const { result } = renderHook(() => useBulkPayment({ limitDetails: mockLimitDetails }));

        const selectedRows = [1];
        const inputValidity = { 1: true };

        await act(async () => {
            await result.current.bulkPaymentApi(1000, { 1: 100 }, selectedRows, inputValidity);
        });

        await waitFor(() => {
            expect(setData).toHaveBeenCalledWith({
                bulkBalanceData: mockBulkBalanceData.beneficiariesBalances,
            });
            expect(navigate).toHaveBeenCalledWith(paths.dashboard.payments);
        });
    });

    it('should show warnings for invalid or too many selected rows in bulkPaymentApi', async () => {
        const { result } = renderHook(() => useBulkPayment({ limitDetails: mockLimitDetails }));

        await act(async () => {
            await result.current.bulkPaymentApi(1000, {}, [], {});
        });

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith({
                variant: 'warning',
                description: 'Please select at least one beneficiary to continue',
            });
        });

        await act(async () => {
            await result.current.bulkPaymentApi(
                1000,
                {},
                Array.from({ length: 1001 }, (_, i) => i + 1),
                {}
            );
        });

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith({
                variant: 'warning',
                description:
                    'You can only process up to 1000 payments at a time. Please reduce the number of payments and try again.',
            });
        });
    });
});
