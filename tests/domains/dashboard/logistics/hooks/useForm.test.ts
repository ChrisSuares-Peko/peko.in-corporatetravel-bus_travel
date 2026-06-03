import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import useForm from '@src/domains/dashboard/logistics/hooks/useForm';
import useSurchargeDetails from '@src/domains/dashboard/logistics/hooks/useSurchargeApi';
// import { resetLogisticsDataState } from '@src/domains/dashboard/logistics/slice/logisticsSlice';
import { setPaymentData } from '@src/domains/dashboard/payments/slices/payment';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useSurchargeApi', () => ({
    default: vi.fn(),
}));

describe('useForm Hook', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        // Mock return values for useNavigate and useDispatch
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppDispatch as any).mockReturnValue(mockDispatch);

        // Reset mocks before each test
        mockDispatch.mockClear();
        mockNavigate.mockClear();
    });

    it('should dispatch setPaymentData and navigate on handleLogisticsSubmission', async () => {
        // Mocking useAppSelector for Redux state
        (useAppSelector as any).mockReturnValueOnce({
            originAddress: { city: 'Origin City' },
            destinationAddress: { city: 'Destination City' },
            shipmentDetails: { productGroup: 'DOM', shipmentContent: 'parcel' },
            shippingAmount: { TotalAmount: 1000 },
        });

        // Mocking useSurchargeDetails for surcharge data
        (useSurchargeDetails as any).mockReturnValueOnce({
            surchargeData: { surcharge: '50', corporateCashback: '10' },
        });

        const { result } = renderHook(() => useForm());

        // Execute handleLogisticsSubmission
        await act(async () => {
            await result.current.handleLogisticsSubmission();
        });

        // Expect dispatch to be called with setPaymentData
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Logistics' },
                    { key: 'Shipment Type', value: 'Domestic' },
                    { key: 'Shipment Content', value: 'Parcel' },
                    { key: 'Amount', value: '1000.00' },
                ],
                paymentSummary: [{ key: 'Platform fee', value: '50' }],
                totalAmount: 1050, // Total amount = shipping + surcharge
                title: 'Bill Summary',
                payload: {
                    originAddress: { city: 'Origin City' },
                    destinationAddress: { city: 'Destination City' },
                    productGroup: 'DOM',
                    shipmentContent: 'parcel',
                    amount: 1000,
                    accessKey: 'shipment_services',
                    currentUrl: window.location.href,
                },
                url: 'travel/logistics/payment',
                earningCashbackAmount: 10,
            })
        );

        // Expect navigation to the payments page
        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
