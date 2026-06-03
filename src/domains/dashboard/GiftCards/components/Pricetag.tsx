import React from 'react';

import { Tag } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

interface PriceTagProps {
    price: number;
    onClick: () => void;
    selected: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, onClick, selected }) => (
    // <Col xs={6} md={5}>
    <Tag
        onClick={onClick}
        style={{ borderRadius: '0.4rem', backgroundColor: 'white' }}
        className={`text-center p-2 text-sm h-10 items-center cursor-pointer my-2 xs:mt-1 md:mt-0 ${
            selected ? 'border border-red-500 bg-stone-50 text-red-500' : 'text-zinc-400'
        }`}
    >
        {`AED ${formatNumberWithLocalString(price)}`}
    </Tag>
    // </Col>
);

export default PriceTag;
