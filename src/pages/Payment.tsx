import React from 'react';

import axios from 'axios';

import { SERVER_URL } from '@src/config-global';

const Payment = () => {
    React.useEffect(() => {
        const paymentData = {
            account: '',
            transactionId: new Date().valueOf(),
            amount: 100,
            accessKey: 'subscription_payments',
            planData: '',
        };
        const fetch = async () => {
            try {
                const resp = await axios.post(
                    `${SERVER_URL}/api/v1/corporate/495/paymentGateway/order`,
                    paymentData
                );
            } catch (error) {
                console.log('🚀 ~ fetch ~ error:', error);
            }
        };
        fetch();
    }, []);
};

export default Payment;
