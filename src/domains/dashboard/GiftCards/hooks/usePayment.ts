import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';

export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // const { role, id } = useAppSelector(state => state.reducer.auth);
    const { surchargeData } = useSurchargeDetails();

    const itemData = useAppSelector(state => state.reducer.giftcardCheckout.productDetails);
    const formData = useAppSelector(state => state.reducer.giftcardCheckout.formDetails);
    // const addressData = useAppSelector(state => state.reducer.giftcardCheckout.addressDetails);

    const { product } = formData;
    const amount = product;

    const total =
        (amount ? parseFloat(amount) : 0) +
        (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

    const handleSubmission = useCallback(
        async (values: any) => {
            const {
                receiverFirstName,
                // receiverLastName,
                // gender: Gender,
                receiverEmail,
                //  receiverMobile,
                //  postcode,
                message,
                senderName,
                employee,
                orderType,
                //  senderEmail,
            } = values;

            const giftCardId = itemData.id;
            const load_amount = formData.amount;
            const number_of_items = formData.quantity;

            const first_name = receiverFirstName;
            //  const last_name = receiverLastName;
            const email = receiverEmail;
            // const telephone = `+971${receiverMobile}`;
            // const gender = Gender;

            const billSummary = [
                { key: 'Service name', value: 'Gift Cards' },
                { key: 'Gift Card Name', value: itemData.product_name },
                { key: 'Quantity', value: formData.quantity },
                // { key: 'Amount ', value: formData.product.toString() },
                {
                    key: 'Amount',
                    value: new Intl.NumberFormat('en-IN').format(Number(amount) ?? 0),
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value: surchargeData?.surcharge ?? 0,
                    // value: Number(surchargeData?.surcharge) ?? 0 ?? 0,
                },
            ];

            const requestBody = {
                giftCardId,
                load_amount,
                first_name,
                //  last_name,
                email,
                employee,
                // gender,
                // telephone,
                number_of_items,
                amount,
                senderName,
                message,
                accessKey: 'gift_cards_combined',
                currentUrl: window.location.href,
                orderType,
            };
            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: 'purchase/giftcards/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) || 0,
                })
            );
            navigate(paths.dashboard.payments);
        },
        [amount, total, dispatch, navigate, itemData, formData, surchargeData]
    );

    return { handleSubmission };
}
