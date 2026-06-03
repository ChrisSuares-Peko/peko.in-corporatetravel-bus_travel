import React from 'react';

import { Flex } from 'antd';

import VatBody from '../components/vatRegistration/VatBody';
import VatHeader from '../components/vatRegistration/VatHeader';

const VATRegistration: React.FC = () => (
    <Flex gap={40} vertical className="w-full lg:w-6/12">
        <VatHeader />
        <VatBody />
    </Flex>
);

export default VATRegistration;
