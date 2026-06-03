import React from 'react';

import { Flex, Image, Typography } from 'antd';

import { retrieveAirlineName } from '../../../utils/airlineData';

interface DynamicImageCardProps {
    item: any;
    flightSegments: any;
}

export default function DynamicImageCard({ item, flightSegments }: DynamicImageCardProps) {
    const operatingAirlines = flightSegments.map(
        (segment: { operatingAirline: any }) => segment.operatingAirline
    );
    const uniqueOperatingAirlines = [...new Set(operatingAirlines)];

    return uniqueOperatingAirlines.length > 1 ? (
        <Flex align="center" justify="center">
            {uniqueOperatingAirlines.map((v, i) => (
                <Image
                    key={i}
                    preview={false}
                    width={50}
                    alt={item.flightCode}
                    src={`https://res.cloudinary.com/dqhshqcqd/image/upload/v1710764763/Airline/${v}.png`}
                />
            ))}
            <Typography.Text className="text-center text-sm font-normal text-[#6B6B6B]">
                Multiple Airlines
            </Typography.Text>
        </Flex>
    ) : (
        <Flex align="center">
            <Image preview={false} width={50} src={item.logo} />
            <Typography.Text className="ms-2 text-sm">
                {retrieveAirlineName(item.flightCode)}
            </Typography.Text>
        </Flex>
    );
}
