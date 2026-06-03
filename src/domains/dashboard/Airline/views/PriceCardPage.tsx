import React from 'react';

import { Col, Divider, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import AirlineDetailBodyMobile from '../components/adaptive/AirlineDetailBodyMobile';
import PriceCardMobile from '../components/adaptive/PriceCardMobile';
import PriceFooter from '../components/adaptive/PriceFooter';
import useGetSelectedAirline from '../hooks/useGetSelectedAirline';
import { formattedDateOnly } from '../utils/dateTime';

type Props = {
    handleClick: () => void;
};
const { Paragraph } = Typography;

const PriceCardPage = ({ handleClick }: Props) => {
    const airlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const selectedAirline = useGetSelectedAirline();
    const duration = airlineData?.flightDuration
        ? airlineData.flightDuration.replace('H', ' h ').replace('M', ' m')
        : 'Duration not available';

    return (
        <Row>
            <Col span={24}>
                <Paragraph className="text-xl font-medium leading-7 capitalize">
                    Review your itinerary
                </Paragraph>
            </Col>
            <Paragraph className="text-xs text-gray-500 leading-7 ">
                {formattedDateOnly(new Date(airlineData.depart.datetime))} . {airlineData.stopCount}{' '}
                Stops . {duration} . {airlineData.flightClass}
            </Paragraph>
            <AirlineDetailBodyMobile />
            <Divider className="border-t-2" />
            <PriceCardMobile />
            <PriceFooter price={airlineData.price ?? 0} handleClick={handleClick} />
        </Row>
    );
};

export default PriceCardPage;
