import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import usePayment from '@domains/dashboard/esim/hooks/usePayment'; // Ensure the path is correct
import useSurchargeDetails from '@domains/dashboard/esim/hooks/useSurchargeApi'; // Ensure the path is correct
import { setPaymentData } from '@domains/dashboard/payments/slices/payment'; // Ensure the path is correct
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('@domains/payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

vi.mock('@domains/dashboard/esim/hooks/useSurchargeApi', () => ({
    default: vi.fn(),
}));

describe('usePayment', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useSurchargeDetails as any).mockReturnValue({
            surchargeData: {
                surcharge: '10',
                corporateCashback: '5',
            },
        });
    });

    it('should calculate payment details and navigate to payment page', async () => {
        const { result } = renderHook(() => usePayment());

        const values = {
            amount: 100,
            packageId: 'package123',
            quantity: 1,
            operatorImage: 'image.png',
            operatorName: 'Operator A',
            isRechargable: true,
            topupType: 'SIM',
            iccid: 'iccid123',
            countries: ['UAE'],
            packageType: 'eSIM',
            region: 'Middle East',
            plan: 'Plan A',
        };

        await act(async () => {
            await result.current.handleSubmission(values);
        });

        const expectedTotal = 100 + 10; // amount + surcharge

        // Verify that setPaymentData was called with the correct arguments
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'eSIM' },
                    { key: 'Operator Name', value: values.operatorName },
                    { key: 'Plan', value: values.plan },
                    { key: 'Amount', value: '95' }, // amount - vat
                    { key: 'VAT (5 %)', value: 'AED 5.00' },
                ],
                paymentSummary: [{ key: 'Platform fee', value: '10' }],
                totalAmount: expectedTotal,
                title: 'eSIM Payment',
                payload: {
                    amount: values.amount,
                    packageId: values.packageId,
                    quantity: values.quantity,
                    operatorImage: values.operatorImage,
                    operatorName: values.operatorName,
                    isRechargable: values.isRechargable,
                    accessKey: accessKeys.eSim,
                    type: values.topupType,
                    iccid: values.iccid,
                    currentUrl: window.location.href,
                    countries: values.countries,
                    packageType: values.packageType,
                    region: values.region,
                },
                url: 'travel/eSIM/payment',
                earningCashbackAmount: 5, // cashback
            })
        );

        // Verify navigation was called with the correct path
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
