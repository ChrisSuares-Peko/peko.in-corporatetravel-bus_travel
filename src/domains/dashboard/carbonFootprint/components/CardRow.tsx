import React from 'react';

import CustomCards from './CustomCards';

type Props = {
    data: {
        img: string;
        title: string;
        value: string;
    }[];
};

const CardRow = ({ data }: Props) => (
    // <Col key={i} className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
    <CustomCards />
    // </Col>
);

export default CardRow;
