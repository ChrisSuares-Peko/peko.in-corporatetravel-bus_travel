import React from 'react';

import { Flex, Typography } from 'antd';

import DeliveryDetailsForm from '../forms/DeliveryDetailsForm';

interface DeliveryDetailsType {
    form1Ref?: any;
}
const DeliveryDetails: React.FC<DeliveryDetailsType> = ({ form1Ref }) => (
    <Flex vertical className="w-full">
        <Flex vertical className="w-full" gap={15}>
            <Typography.Text className="text-lg font-medium">
                Pickup and Delivery Details
            </Typography.Text>
            <DeliveryDetailsForm form1Ref={form1Ref} />
        </Flex>
    </Flex>
);

export default DeliveryDetails;
