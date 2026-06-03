import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { setPaymentData } from '../../../payments/slices/payment';
import usePayment from '../../hooks/usePayment';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('../../payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('usePayment', () => {
    let dispatchMock: ReturnType<typeof vi.fn>;
    let navigateMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        dispatchMock = vi.fn();
        navigateMock = vi.fn();
        (useAppDispatch as any).mockReturnValue(dispatchMock);
        (useNavigate as any).mockReturnValue(navigateMock);

        vi.clearAllMocks();
    });

    it('should dispatch setPaymentData and navigate on handleSubmission', async () => {
        const paymentPageData = {
            serviceName: 'Electricity',
            accountNumber: '12345',
            beneficiaryName: 'John Doe',
            rechargeAmount: '200',
            TransactionId: 'txn123',
            flexiKey: 'flexiKey',
            typeKey: 'typeKey',
            surcharge: '10',
            dueBalanceInAed: '180',
            minimumAmountInAed: '50',
            maximumAmountInAed: '500',
            minDenomination: '10',
            maxDenomination: '100',
            accessKey: 'accessKey',
            earningCashbackAmount: 5,
            CurrentBalance: '200',
            serviceType: 'Electricity',
            accountPin: '1234',
            ProviderTransactionId: 'providerTxn123',
            optional1: 'optional1',
            optional2: 'optional2',
        };

        const { result } = renderHook(() => usePayment());

        await act(async () => {
            await result.current.handleSubmission(paymentPageData);
        });

        expect(dispatchMock).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Electricity' },
                    { key: 'Beneficiary name', value: 'John Doe' },
                    { key: 'Beneficiary number', value: '12345' },
                    { key: 'Amount', value: 200, isInput: true },
                ],
                paymentSummary: [{ key: 'Platform fee', value: '10' }],
                totalAmount: 210,
                title: 'Bill Summary',
                payload: {
                    amount: 200,
                    bulkPaymentData: [
                        {
                            account: '12345',
                            amount: 200,
                            transactionId: 'txn123',
                            flexiKey: 'flexiKey',
                            typeKey: 'typeKey',
                            providerTransactionId: 'providerTxn123',
                            lastBalance: '200',
                            type: 'Electricity',
                            pin: '1234',
                            optional1: 'optional1',
                            optional2: 'optional2',
                        },
                    ],
                    accessKey: 'accessKey',
                    currentUrl: 'http://localhost:3000/',
                },
                url: 'payment/bulk-payment/payment',
                minimumAmount: 50,
                maximumAmount: 500,
                earningCashbackAmount: 5,
            })
        );

        expect(navigateMock).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
