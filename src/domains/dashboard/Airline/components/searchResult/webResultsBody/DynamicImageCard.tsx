import React from 'react';

import { Flex, Image, Typography } from 'antd';

import { retrieveAirlineName } from '../../../utils/airlineData';

interface DynamicImageCardProps {
    item: any;
    flightSegments: any;
}

export default function DynamicImageCard({ item, flightSegments }: DynamicImageCardProps) {
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    const operatingAirlines = flightSegments.map(
        (segment: { operatingAirline: any }) => segment.operatingAirline
    );
    const uniqueOperatingAirlines = [...new Set(operatingAirlines)];

    return uniqueOperatingAirlines.length > 1 ? (
        <Flex vertical align="center" justify="center">
            {uniqueOperatingAirlines.map((v, i) => (
                <Image
                    key={i}
                    preview={false}
                    width={60}
                    alt={item.flightCode}
                    src={`https://res.cloudinary.com/dqhshqcqd/image/upload/v1710764763/Airline/${v}.png`}
                />
            ))}
            <Typography.Text className="text-center mt-1 text-sm font-normal text-[#6B6B6B]">
                Multiple Airlines
            </Typography.Text>
        </Flex>
    ) : (
        <>
            <Image preview={false} width={80} alt={item.flightCode} src={item.logo} />
            <Typography.Text className="capitalize text-center mt-2 font-medium">
                {capitalizeFirstLetter(retrieveAirlineName(item.flightCode))}
            </Typography.Text>
            <Typography.Text className="capitalize text-center md:text-xs">
                {item.operatingAirline}-{item.flightNumber}
            </Typography.Text>
        </>
    );
}
