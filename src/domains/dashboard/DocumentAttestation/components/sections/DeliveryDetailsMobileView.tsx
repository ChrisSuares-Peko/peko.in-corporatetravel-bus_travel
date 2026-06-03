import React from 'react';

import { Flex } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import CheckPrice from './CheckPrice';
import DeliveryDetails from './DeliveryDetails';

type DeliverDetailsMobileViewProps = {};

const DeliverDetailsMobileView: React.FC<DeliverDetailsMobileViewProps> = () => {
    const docData = useAppSelector(state => state.reducer.documentAttestation.data);
    const data = {
        actualPrice: Number(docData.actualPrice),
        price: Number(docData.amount),
    };
    return (
        <Flex vertical gap={18}>
            <CheckPrice data={data} issuedCountry={docData.issuedCountry} />
            <DeliveryDetails />
        </Flex>
    );
};

export default DeliverDetailsMobileView;
