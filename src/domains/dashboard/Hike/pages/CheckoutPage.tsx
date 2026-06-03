import React from 'react';

import { Typography } from 'antd';

import Checkout from '../components/Checkout';

const CheckoutPage: React.FC = () => (
    <>
        <Checkout />
        <Typography.Text className="text-medium font-medium mt-2">
            After the purchase, the voucher details will be sent to the employees via email.
        </Typography.Text>
    </>
);

export default CheckoutPage;
