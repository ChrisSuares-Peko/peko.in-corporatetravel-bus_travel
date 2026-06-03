import React from 'react';

import { Col } from 'antd';

import FlightCardMobile from './FlightCardMobile';

const AirlineDetailBodyMobile = () => (
    <Col span={24} className="mt-5">
        <FlightCardMobile />
        {/* <Divider className="border-t-2" /> */}
        {/* <ApplyCoupon /> */}
    </Col>
);

export default AirlineDetailBodyMobile;
