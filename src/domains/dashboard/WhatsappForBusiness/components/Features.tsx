import React from 'react';

import { Col, Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ReactSVG } from 'react-svg';

import { features } from '../utils';

const Features = () => (
    <Content className="xl:px-14">
        <Col span={24} className="px-0 my-10 xl:px-10 xxl:px-40">
            <Flex vertical className="w-full text-center">
                <Typography.Text className="text-2xl font-semibold">Key features</Typography.Text>
                <Typography.Text className="text-lg font-normal text-textGreyColor">
                    Smart tools for efficient and personalized communication
                </Typography.Text>
            </Flex>
            <div className="grid grid-cols-1 gap-8 my-10 sm:grid-cols-2">
                {features.map((feature, index) => (
                    <Flex
                        key={index}
                        className="p-6 duration-300 ease-in-out transform border rounded-xl   "
                        gap={20}
                    >
                        <ReactSVG src={feature.icon} />
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-lg font-semibold">
                                {feature.title}
                            </Typography.Text>
                            <Typography.Text className="text-base font-normal text-textGreyColor">
                                {feature.description}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                ))}
            </div>
        </Col>
    </Content>
);

export default Features;
