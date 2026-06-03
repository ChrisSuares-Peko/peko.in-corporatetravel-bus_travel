import { useState } from 'react';

import usePaymentRequest from './usePaymentRequest';

const useHandlePayment = () => {
    const { handlePaymentRequest } = usePaymentRequest();

    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false);

    const handleSubmit = async (data: any) => {
        const payStatus = await handlePaymentRequest(data);
        setPaymentSuccessful(payStatus);
    };

    return { handleSubmit, paymentSuccessful };
};

export default useHandlePayment;
