import React from 'react';

import { Col, Image, Row, Typography } from 'antd';

import img from '../assets/event.png';
import EventView from '../components/EventView';

const EventDetails = () => (
    <>
        <Row>
            <Col span={24}>
                <Image src={img} width="100%" height="100%" />
            </Col>
        </Row>

        <EventView />
        <Row>
            <Col span={24} className="mt-6">
                <Typography.Text className="font-bold">About Event</Typography.Text>
                <Typography.Paragraph className="mt-2">
                    Future Urbanism Expo is proud to co-locate with industry defining events that
                    together make up the world’s largest tech ecosystem; GITEX GLOBAL, GITEX Impact,
                    Ai Everything, Global DevSlam, XVERSE, and Future Electric Expo. One attendee
                    ticket for all shows to let you discover the world’s most influential ecosystems
                    advancing technology, showcasing innovation, pioneering change to enable digital
                    transformation in Smart City Innovations, Infrastructure and Buildings,
                    Sustainability Tech, ESG Strategies, Ai, robotics, HealthTech, DeepTech, EdTech,
                    FinTech, Metaverse, Web 3.0, coding, future mobility and many more.
                </Typography.Paragraph>
            </Col>
        </Row>
        {/* <Row>
            <Col span={24} className='mt-6'>
            <Typography.Text className='font-bold'>
                Website
            </Typography.Text>
            <Typography.Paragraph className='mt-2'>
            Future Urbanism Expo is proud to co-locate with industry defining events that together make up the world’s largest tech ecosystem; GITEX GLOBAL, GITEX Impact, Ai Everything, Global DevSlam, XVERSE, and Future Electric Expo. One attendee ticket for all shows to let you discover the world’s most influential ecosystems advancing technology, showcasing innovation, pioneering change to enable digital transformation in Smart City Innovations, Infrastructure and Buildings, Sustainability Tech, ESG Strategies, Ai, robotics, HealthTech, DeepTech, EdTech, FinTech, Metaverse, Web 3.0, coding, future mobility and many more.
            </Typography.Paragraph>
            </Col>
        </Row> */}
    </>
);

export default EventDetails;
