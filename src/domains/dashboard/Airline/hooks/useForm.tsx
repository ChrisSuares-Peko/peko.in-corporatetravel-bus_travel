import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useBasicInfoApi from './useGetBasicInfo';
import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { resetFormState } from '../slices/airlineSlice';
import { retrieveAirlineName } from '../utils/airlineData';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedAirline } = useAppSelector(state => state.reducer.airline);

    const { data } = useBasicInfoApi();

    const { getSurchargeData } = useSurchargeDetails();

    const handleSubmission = useCallback(
        async (values: any, bookingDetails: any) => {
            const { amount } = bookingDetails;
            const surchargeData = await getSurchargeData(amount);

            const total =
                (parseFloat(amount) || 0) +
                (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

            const billSummary = [
                {
                    key: 'Service name',
                    value: 'Airline',
                },
                {
                    key: 'Name',
                    value: retrieveAirlineName(selectedAirline?.flightCode) ?? ' ',
                },
                {
                    key: 'Company',
                    value: data?.name ?? ' ',
                },
            ];

            const paymentSummary = [
                {
                    key: 'Base amount',
                    value: `AED ${formatNumberWithLocalString(bookingDetails?.amount || 0)}`,
                },
                {
                    key: 'Platform fee',
                    value: `${new Intl.NumberFormat('en-IN').format(
                        Number(Number(surchargeData?.surcharge).toFixed(2)) ?? 0
                    )}`,
                },
            ];

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: values,
                    url: 'travel/flight/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) || 0,
                })
            );
            dispatch(resetFormState());
            navigate(paths.dashboard.payments);
        },
        [data, selectedAirline, dispatch, getSurchargeData, navigate]
    );

    return { handleSubmission };
}
