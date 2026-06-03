import React from 'react';

import { Col, Flex, Typography } from 'antd';

type Props = {};

// eslint-disable-next-line arrow-body-style
const ContentHeader = (props: Props) => {
    return (
        <Col span={24} className="w-full">
            <Flex className="w-full" justify="center" vertical>
                <Typography.Text className="xs:text-base sm:text-3xl font-semibold text-center">
                    Finest Insurance Plans
                </Typography.Text>
                <Typography.Text className="xs:text-xs sm:text-sm font-normal text-center leading-8">
                    At your fingertips. With stunning discounts. And more in store !
                </Typography.Text>
            </Flex>
        </Col>
    );
};

export default ContentHeader;
