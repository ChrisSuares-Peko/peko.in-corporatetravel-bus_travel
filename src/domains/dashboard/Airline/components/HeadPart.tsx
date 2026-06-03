import React from 'react';

import { Flex, Row, Typography } from 'antd';

export default function HeadPart() {
    return (
        <Row justify="space-between">
            <Flex vertical className="gap-0 sm:gap-2">
                <Typography.Title level={3}>Corporate Travel</Typography.Title>
                <Typography.Text className="text-sm text-gray-500">
                    Business Travel Simplified
                </Typography.Text>
            </Flex>
        </Row>
    );
}
