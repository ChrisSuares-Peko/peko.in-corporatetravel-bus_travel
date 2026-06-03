import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { originAddress, destinationAddress, shipmentDetails, shippingAmount } = useAppSelector(
        state => state.reducer.logistics
    );
    const { surchargeData } = useSurchargeDetails();

    const total =
        (shippingAmount.TotalAmount ? parseFloat(shippingAmount.TotalAmount.toString()) : 0) +
        (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

    const handleLogisticsSubmission = useCallback(async () => {
        const billSummary = [
            {
                key: 'Service name',
                value: 'Logistics',
            },
            {
                key: 'Shipment Type',
                value: shipmentDetails.productGroup === 'DOM' ? 'Domestic' : 'International',
            },
            {
                key: 'Shipment Content',
                value: shipmentDetails.shipmentContent === 'parcel' ? 'Parcel' : 'Document',
            },
            {
                key: 'Amount',
                value: shippingAmount.TotalAmount.toFixed(2) ?? 0,
            },
        ];

        const paymentSummary = [
            {
                key: 'Platform fee',
                value: surchargeData?.surcharge ?? 0,
            },
        ];

        const requestBody = {
            originAddress,
            destinationAddress,
            ...shipmentDetails,
            amount: shippingAmount.TotalAmount,
            accessKey: accessKeys.shipmentServices,
            currentUrl: window.location.href,
        };
        dispatch(
            setPaymentData({
                billSummary,
                paymentSummary,
                totalAmount: total,
                title: 'Bill Summary',
                payload: requestBody,
                url: 'travel/logistics/payment',
                earningCashbackAmount:
                    Number(surchargeData && surchargeData?.corporateCashback) || 0,
            })
        );
        navigate(paths.dashboard.payments);
    }, [
        shippingAmount,
        dispatch,
        navigate,
        originAddress,
        destinationAddress,
        shipmentDetails,
        surchargeData,
        total,
    ]);

    return { handleLogisticsSubmission };
}
