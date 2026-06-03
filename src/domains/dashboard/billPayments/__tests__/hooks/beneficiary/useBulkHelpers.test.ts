import { renderHook, act } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import useBulkHelpers from '../../../hooks/beneficiary/useBulkHelpers';
import { GetLimitResponse } from '../../../types';
import { BeneficiaryBulkBalance } from '../../../types/bulkPayment';

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useBulkHelpers', () => {
    const mockBulkBalanceData: BeneficiaryBulkBalance[] = [
        {
            key: 1,
            status: true,
            data: {
                id: 1,
                name: 'Beneficiary 1',
                accountNo: '123456789',
                dueBalanceInAed: '100.00',
                optional1: 'Optional 1',
                status: 'Active',
                ResponseCode: '200',
                ResponseMessage: 'Success',
                TransactionId: 'txn123',
                surchargeInAED: '0.00',
                ServiceType: 'Service A',
                TransactionType: 'Credit',
                ProviderTransactionId: 'providerTxn123',
                TransactionDateStamp: '2024-08-01T00:00:00Z',
                ReplyDateStamp: '2024-08-01T00:00:00Z',
                CurrentBalance: '1000.00',
            },
            message: 'Beneficiary 1 selected',
        },
        {
            key: 2,
            status: false,
            data: {
                id: 2,
                name: 'Beneficiary 2',
                accountNo: '987654321',
                dueBalanceInAed: '200.00',
                optional1: 'Optional 2',
                status: 'Inactive',
                ResponseCode: '404',
                ResponseMessage: 'Not Found',
                TransactionId: 'txn456',
                surchargeInAED: '0.00',
                ServiceType: 'Service B',
                TransactionType: 'Debit',
                ProviderTransactionId: 'providerTxn456',
                TransactionDateStamp: '2024-08-01T00:00:00Z',
                ReplyDateStamp: '2024-08-01T00:00:00Z',
                CurrentBalance: '2000.00',
            },
            message: 'Beneficiary 2 not found',
        },
    ];
    const mockLimitData: GetLimitResponse = {
        minDenomination: 50,
        maxDenomination: 150,
        flexiKey: 'flexiKeyValue',
        typeKey: 1,
        accessKey: 'accessKeyValue',
        serviceProvider: 'serviceProviderValue',
        surcharge: 'surchargeValue',
    };

    beforeEach(() => {
        (useAppSelector as Mock).mockImplementation(selector =>
            selector({
                reducer: {
                    beneficiary: {
                        bulkBalanceData: mockBulkBalanceData,
                    },
                },
            })
        );

        (useLocation as Mock).mockReturnValue({
            state: {},
        });
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useBulkHelpers({ limitData: mockLimitData }));

        expect(result.current.totalAmount).toBe(0);
        expect(result.current.selectedRows).toEqual([]);
        // Update the expected amounts to match the hook's behavior
        expect(result.current.amounts).toEqual({
            1: 100,
        });
    });

    it('should update totalAmount when selectedRows changes', () => {
        const { result } = renderHook(() => useBulkHelpers({ limitData: mockLimitData }));

        act(() => {
            result.current.rowSelection.onChange([1]);
        });
        expect(result.current.totalAmount).toBe(100);

        act(() => {
            result.current.rowSelection.onChange([1, 2]);
        });
        expect(result.current.totalAmount).toBe(100);
    });

    it('should handle amount change and validate based on limitData', () => {
        const { result } = renderHook(() => useBulkHelpers({ limitData: mockLimitData }));

        act(() => {
            result.current.handleAmountChange(1, 120);
        });

        expect(result.current.amounts[1]).toBe(120);
        expect(result.current.inputValidity[1]).toBe(true);

        act(() => {
            result.current.handleAmountChange(1, 200);
        });

        expect(result.current.amounts[1]).toBe(200);
        expect(result.current.inputValidity[1]).toBe(false);
    });

    it('should filter bulkBalanceDataArray based on searchValue', () => {
        const { result } = renderHook(() => useBulkHelpers({ limitData: mockLimitData }));

        act(() => {
            result.current.handleSearch('Beneficiary 1');
        });

        expect(result.current.bulkBalanceDataArray).toEqual([mockBulkBalanceData[0]]);

        act(() => {
            result.current.handleSearch('987654321');
        });

        expect(result.current.bulkBalanceDataArray).toEqual([mockBulkBalanceData[1]]);
    });

    it('should update inputTouched when selecting rows', () => {
        const { result } = renderHook(() => useBulkHelpers({ limitData: mockLimitData }));

        act(() => {
            result.current.rowSelection.onSelect(mockBulkBalanceData[0], true);
        });

        expect(result.current.inputTouched[1]).toBe(true);

        act(() => {
            result.current.rowSelection.onSelect(mockBulkBalanceData[1], true);
        });

        expect(result.current.inputTouched[2]).toBe(true);
    });
});
