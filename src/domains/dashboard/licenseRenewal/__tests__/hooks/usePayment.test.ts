import { renderHook, act } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../../payments/slices/payment';
import usePayment from '../../hooks/usePayment';
import useSurchargeDetails from '../../hooks/useSurchargeApi';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('../../hooks/useSurchargeApi', () => ({
    default: vi.fn(),
}));

vi.mock('@utils/accessKeys', () => ({
    accessKeys: {
        dubaiDED: 'mockedDubaiDEDKey',
    },
}));

vi.mock('dayjs', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '01/Jan/2024'),
    })),
}));

describe('usePayment', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockLocationState = {
        AccountNumber: '123456',
        TransactionId: 'trans123',
        Amount: '100',
        VoucherExpiryDate: '2024-01-01',
        VoucherNumber: 'V123456',
        surchargeInAED: '10',
    };

    beforeEach(() => {
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should navigate to the license renewal page if paymentPageData is missing', () => {
        (useLocation as Mock).mockReturnValue({ state: null });

        let caughtError: Error | null = null;

        renderHook(() => {
            try {
                usePayment();
            } catch (e) {
                caughtError = e as Error;
            }
        });

        // Assert that the navigation function was called correctly
        expect(mockNavigate).toHaveBeenCalledWith(`/${paths.licenseRenewal.index}`);

        // Optionally, assert that an error was thrown
        expect(caughtError).toBeTruthy();
    });

    it('should set payment data and navigate to the payments page on form submission', async () => {
        // Use a non-null paymentPageData for this test case
        (useLocation as Mock).mockReturnValue({ state: mockLocationState });
        (useSurchargeDetails as Mock).mockReturnValue({ surchargeData: { corporateCashback: 5 } });

        const { result } = renderHook(() => usePayment());

        const mockFormValues = {
            customerName: 'John Doe',
            emiratesId: '123-456-789',
        };

        await act(async () => {
            result.current.handleSubmission(mockFormValues);
        });

        const expectedRequestBody = {
            account: '123456',
            transactionId: 'trans123',
            amount: '100',
            customerName: 'John Doe',
            emiratesId: '123-456-789',
            voucherNumber: 'V123456',
            surchargeInAED: 10,
            flexiKey: undefined,
            typeKey: undefined,
            payCashback: false,
            accessKey: accessKeys.dubaiDED,
            currentUrl: window.location.href,
        };

        const expectedBillSummary = [
            { key: 'Service name', value: 'License Renewal' },
            { key: 'Voucher ID', value: '123456' },
            { key: 'Renewal Date', value: '01/Jan/2024' },
            { key: 'Amount', value: '100' },
        ];

        const expectedPaymentSummary = [{ key: 'Platform fee', value: 10 }];

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: expectedBillSummary,
                paymentSummary: expectedPaymentSummary,
                totalAmount: 110,
                title: 'Bill Summary',
                payload: expectedRequestBody,
                url: 'payment/licenseRenewal/payment',
                earningCashbackAmount: 5,
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
