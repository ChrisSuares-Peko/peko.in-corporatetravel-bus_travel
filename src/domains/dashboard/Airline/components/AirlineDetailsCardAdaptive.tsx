import React from 'react';

import { Row, Col, Divider, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import { retrieveAirport } from '../utils/airlineData';
import { formattedDateOnly, formattedTimeOnly } from '../utils/dateTime';

type Props = {};

const AirlineDetailsCardAdaptive = (props: Props) => {
    const airlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const duration = airlineData?.flightDuration
        ? airlineData.flightDuration.replace('H', ' h ').replace('M', ' m')
        : 'Duration not available';
    return (
        <Row className="mb-7" justify="space-between">
            <Col span={9} className="flex flex-col items-start ">
                <Typography.Text className="text-gray-400 text-xs font-normal">
                    {formattedTimeOnly(new Date(airlineData.depart.datetime))}
                </Typography.Text>
                <Typography.Text className="font-bold text-2xl mt-1">
                    {formattedDateOnly(new Date(airlineData.depart.datetime))}
                </Typography.Text>
                <Typography.Text className="font-medium text-sm">
                    {' '}
                    {retrieveAirport(airlineData.onPoint)}
                </Typography.Text>
                <Typography.Text className="text-xs font-normal text-gray-400 line-clamp-2">
                    {' '}
                </Typography.Text>
            </Col>
            <Col span={6} className="flex flex-col items-center justify-center">
                <Typography.Text className="text-gray-400 text-xs">{duration}</Typography.Text>
                <Divider className="m-1" />
                <Typography.Text className="text-gray-400 text-xs">
                    {airlineData.stopCount} Stop
                </Typography.Text>
            </Col>

            <Col span={9} className="flex flex-col items-end ">
                <Typography.Text className="text-gray-400 text-xs font-normal">
                    {formattedTimeOnly(new Date(airlineData.arrive.datetime))}
                </Typography.Text>
                <Typography.Text className="font-bold text-2xl mt-1">
                    {formattedDateOnly(new Date(airlineData.arrive.datetime))}
                </Typography.Text>
                <Typography.Text className="font-medium text-sm">
                    {' '}
                    {retrieveAirport(airlineData.offPoint)}
                </Typography.Text>
                <Typography.Text className="text-xs font-normal text-gray-400 line-clamp-2 text-right">
                    {' '}
                </Typography.Text>
            </Col>
        </Row>
    );
};

export default AirlineDetailsCardAdaptive;
