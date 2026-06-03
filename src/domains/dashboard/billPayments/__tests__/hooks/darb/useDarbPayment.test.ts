import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../../../payments/slices/payment';
import useDarbPayment from '../../../hooks/darb/useDarbPayment';
import { darbPaymentPayload } from '../../../types/darb';

// Mock the necessary modules and functions
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

// Mock GetSurcharge module directly
const mockGetSurchargeData = vi.fn();
vi.mock('../../../hooks/useSurcharge', () => ({
    default: () => ({
        getSurchargeData: mockGetSurchargeData,
        surchargeData: undefined,
        isLoading: false,
    }),
}));

vi.mock('../../../../payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useDarbPayment', () => {
    const mockNavigate = vi.fn(); // Create a mock function for navigate
    const mockDispatch = vi.fn(); // Create a mock function for dispatch

    beforeEach(() => {
        // Reset mocks before each test
        (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
        (useAppDispatch as unknown as Mock).mockReturnValue(mockDispatch);

        // Reset all mocks
        mockNavigate.mockReset();
        mockDispatch.mockReset();
        mockGetSurchargeData.mockReset();
    });

    it('should handle submission with valid values and dispatch payment data', async () => {
        const mockValues: darbPaymentPayload = {
            flexiKey: 'flexiKey123',
            amount: 100,
            account: 'account123',
            transactionId: 'transaction123',
            typeKey: 1234,
            optional1: 'optional1',
            optional2: 'optional2',
            minAmt: '50',
            maxAmt: '200',
        };

        const mockSurchargeData = { surcharge: '10' };
        mockGetSurchargeData.mockResolvedValue(mockSurchargeData);

        const { result } = renderHook(() => useDarbPayment());

        await act(async () => {
            await result.current.handleSubmission(mockValues);
        });

        const expectedTotal = 110; // 100 (amount) + 10 (surcharge)

        console.log('mockGetSurchargeData calls:', mockGetSurchargeData.mock.calls);

        expect(mockGetSurchargeData).toHaveBeenCalledWith(mockValues.amount, accessKeys.darb);
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'DARB' },
                    { key: 'Amount', value: mockValues.amount, isInput: true },
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
                    flexiKey: mockValues.flexiKey,
                    amount: expectedTotal,
                    account: mockValues.account,
                    transactionId: mockValues.transactionId,
                    payCashback: false,
                    typeKey: mockValues.typeKey,
                    optional1: mockValues.optional1,
                    optional2: mockValues.optional2,
                    accessKey: accessKeys.darb,
                    currentUrl: window.location.href,
                },
                url: 'payment/darb/payment',
                minimumAmount: Number(mockValues.minAmt),
                maximumAmount: Number(mockValues.maxAmt),
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
