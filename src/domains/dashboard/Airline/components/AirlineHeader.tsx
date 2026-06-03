import React from 'react';

import { Flex, Image, Typography } from 'antd';

import emiratesImage from '../assets/images/emirates.png';

interface AirlineHeaderProps {
    flightClass: string;
    airlineLogo?: string;
}

const AirlineHeader: React.FC<AirlineHeaderProps> = ({ flightClass, airlineLogo }) => (
    <Flex justify="space-between" align="center" className="">
        <Flex className="mb-3">
            <Image
                width={70}
                src={airlineLogo || emiratesImage}
                preview={false}
                alt="Logo"
                style={{ objectFit: 'contain' }}
            />
        </Flex>
        <Flex>
            <Typography.Text style={{ margin: 0, color: 'red' }}>
                {flightClass} Class
            </Typography.Text>
        </Flex>
    </Flex>
);

export default AirlineHeader;
