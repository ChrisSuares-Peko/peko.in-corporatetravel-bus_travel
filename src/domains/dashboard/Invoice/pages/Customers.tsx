import React from 'react';

import { Flex, Typography } from 'antd';

import CustomerTable from '../components/customers/CustomerTable';

const Customers = () => (
    <Flex vertical gap={18} className="w-full">
        <Typography.Text className="text-xl font-medium">Customers</Typography.Text>
        <CustomerTable />
    </Flex>
);

export default Customers;
