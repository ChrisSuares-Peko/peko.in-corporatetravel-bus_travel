import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../../../payments/slices/payment';
import useHafilatPayment from '../../../hooks/hafilat/useHafilatPayment';
import GetSurcharge from '../../../hooks/useSurcharge';

// Mock the necessary modules and functions
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('../../../hooks/useSurcharge', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        getSurchargeData: vi.fn(),
    })),
}));

vi.mock('../../../../payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useHafilatPayment', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockGetSurchargeData = vi.fn();

    beforeEach(() => {
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
        (GetSurcharge as Mock).mockReturnValue({
            getSurchargeData: mockGetSurchargeData,
        });
    });

    it('should handle submission and dispatch payment data', async () => {
        const mockValues = {
            account: '12345',
            transactionId: 'transactionId123', // Add this property
            amount: 100,
            flexiKey: 'flexiKey123',
            typeKey: 1234,
            optionals: {
                ProductCode: '',
                isTPurse: '',
                customerMobileNo: '',
                itemCode: null, // This is optional and can be included if needed
            },
        };

        const mockSurchargeData = { surcharge: '10' };
        mockGetSurchargeData.mockResolvedValue(mockSurchargeData);

        const { result } = renderHook(() => useHafilatPayment());

        await act(async () => {
            await result.current.handleSubmission(mockValues);
        });

        const expectedTotal = 110; // 100 (amount) + 10 (surcharge)

        expect(mockGetSurchargeData).toHaveBeenCalledWith(mockValues.amount, accessKeys.hafilat);
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Hafilat' },
                    { key: 'Beneficiary number', value: mockValues.account },
                    { key: 'Amount', value: mockValues.amount, isInput: false },
                ],
                paymentSummary: [
                    {
                        key: 'Platform fee',
                        value: new Intl.NumberFormat('en-IN').format(
                            Number(mockSurchargeData.surcharge) ?? 0
                        ),
                    },
                ],
                totalAmount: expectedTotal,
                title: 'Bill Summary',
                payload: {
                    account: mockValues.account,
                    amount: expectedTotal,
                    transactionId: expect.any(String),
                    payCashback: false,
                    flexiKey: mockValues.flexiKey,
                    typeKey: mockValues.typeKey,
                    accessKey: accessKeys.hafilat,
                    currentUrl: window.location.href,
                    optionals: mockValues.optionals,
                },
                url: 'payment/hafilat/payment',
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should handle submission with missing optional fields and dispatch payment data', async () => {
        const mockValues = {
            account: '12345',
            transactionId: 'transactionId123', // Add this property
            amount: 100,
            flexiKey: 'flexiKey123',
            typeKey: 1234,
            optionals: {
                ProductCode: '',
                isTPurse: '',
                customerMobileNo: '',
                itemCode: null, // This is optional and can be included if needed
            },
        };
        const mockSurchargeData = { surcharge: '10' };
        mockGetSurchargeData.mockResolvedValue(mockSurchargeData);

        const { result } = renderHook(() => useHafilatPayment());

        await act(async () => {
            await result.current.handleSubmission(mockValues);
        });

        const expectedTotal = 110; // 100 (amount) + 10 (surcharge)

        expect(mockGetSurchargeData).toHaveBeenCalledWith(mockValues.amount, accessKeys.hafilat);
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Hafilat' },
                    { key: 'Beneficiary number', value: mockValues.account },
                    { key: 'Amount', value: mockValues.amount, isInput: false },
                ],
                paymentSummary: [
                    {
                        key: 'Platform fee',
                        value: new Intl.NumberFormat('en-IN').format(
                            Number(mockSurchargeData.surcharge) ?? 0
                        ),
                    },
                ],
                totalAmount: expectedTotal,
                title: 'Bill Summary',
                payload: {
                    account: mockValues.account,
                    amount: expectedTotal,
                    transactionId: expect.any(String),
                    payCashback: false,
                    flexiKey: mockValues.flexiKey,
                    typeKey: mockValues.typeKey,
                    accessKey: accessKeys.hafilat,
                    currentUrl: window.location.href,
                    optionals: mockValues.optionals,
                },
                url: 'payment/hafilat/payment',
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
