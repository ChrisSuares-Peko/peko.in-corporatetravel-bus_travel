import React from 'react';

import { Col, Row, Button, Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const WorksHeader = () => (
    <Row align="middle" gutter={12} justify="space-between">
        <Col>
            <Typography.Text className=" font-medium text-lg sm:text-xl">
                Peko Works -
            </Typography.Text>
            <Typography.Text className=" text-lg ml-1">Get things done faster</Typography.Text>
        </Col>
        <Col>
            <Flex justify="center" gap={5}>
                <Link to={`${paths.dashboard.works}/${paths.works.orderHistory}`}>
                    <Button danger type="default" size="middle" className="px-5">
                        Order History
                    </Button>
                </Link>
            </Flex>
        </Col>
    </Row>
);

export default WorksHeader;
