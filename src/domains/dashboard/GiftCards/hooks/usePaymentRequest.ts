import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { makePayment } from '../api';
import { PaymentPayload } from '../types/types';

export default function usePaymentRequest() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const navigate = useNavigate();

    const handlePaymentRequest = async (payload: PaymentPayload): Promise<boolean> => {
        const response = await makePayment({
            ...payload,
            credentialId: id,
            userType: role,
        });

        if (response === true) {
            navigate(`/${paths.giftcards.index}/${paths.giftcards.success}`);
        } else {
            navigate(`/${paths.giftcards.index}/${paths.giftcards.failure}`);
        }

        return response;
    };

    return { handlePaymentRequest };
}
