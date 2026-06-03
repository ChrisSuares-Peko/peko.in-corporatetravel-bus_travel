import React from 'react';

import { Button, Col, Flex, Row, Typography } from 'antd';

const EventView = () => (
    <Row>
        <Col span={18} className="mt-7">
            <Flex vertical>
                <Typography.Text className="font-medium text-xl">
                    Future Urbanism Smart City Summit and Expo
                </Typography.Text>
                <Typography.Text className="text-sm mt-2">
                    World Trade Centre, Dubai
                </Typography.Text>
                <Flex gap={70}>
                    <Flex vertical>
                        <Typography.Text className="text-sm mt-2 text-textGrey">
                            Starts on
                        </Typography.Text>
                        <Typography.Text className="text-sm mt-2 font-medium">
                            16 Oct 2023
                        </Typography.Text>
                    </Flex>

                    <Flex vertical>
                        <Typography.Text className="text-sm mt-2 text-textGrey">
                            Start Time
                        </Typography.Text>
                        <Typography.Text className="text-sm mt-2 font-medium">
                            7:30 pm
                        </Typography.Text>
                    </Flex>

                    <Flex vertical>
                        <Typography.Text className="text-sm mt-2 text-textGrey">
                            Ends On
                        </Typography.Text>
                        <Typography.Text className="text-sm mt-2 font-medium">
                            16 Oct 2023
                        </Typography.Text>
                    </Flex>

                    <Flex vertical>
                        <Typography.Text className="text-sm mt-2 text-textGrey">
                            Duration
                        </Typography.Text>
                        <Typography.Text className="text-sm mt-2 font-medium">
                            Full Day
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
        </Col>
        <Col span={6} className="mt-7">
            <Button danger type="primary" className="w-full font-medium px-5 h-10">
                Book Ticket
            </Button>
        </Col>
    </Row>
);

export default EventView;
