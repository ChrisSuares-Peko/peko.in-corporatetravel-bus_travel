import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row } from 'antd';

import EventList from '../components/EventList';
import { EventLists } from '../utils/data';

const Events = () => (
    <>
        <Row>
            <Col xs={12} sm={12} md={20}>
                {/* <Typography.Paragraph>{count} Softwares</Typography.Paragraph> */}
            </Col>
            <Col xs={0} sm={0} md={4} lg={4} xl={4}>
                <Input
                    placeholder="Search"
                    suffix={<SearchOutlined />}
                    allowClear
                    type="text"
                    maxLength={100}
                    className="text-[.8rem] sm:text-[.9rem]"
                />
            </Col>
        </Row>

        <Row gutter={20}>
            {EventLists.map((item, i) => (
                <Col span={8}>
                    <EventList image={item.image} name={item.name} desc={item.description} />
                </Col>
            ))}
        </Row>
    </>
);

export default Events;
