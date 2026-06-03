/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Col, Empty, Flex, Grid, Input, Row, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import ConnectListCard from '../components/ConnectListCard';
import { useConnectApi } from '../hooks/useConnectApi';

const Connect = () => {
    const { data, isLoading } = useConnectApi();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <Content className="mt-2 sm:mt-0">
            <Input
                placeholder="Search"
                suffix={<SearchOutlined />}
                allowClear
                type="text"
                maxLength={40}
                className="rounded-md hidden mt-7"
                onChange={e => setSearchTerm(e.target.value)}
            />
            <Typography.Text className="font-medium text-lg sm:text-xl">
                Marketplace -
                <br className="xs:block sm:hidden" />
                <Typography.Text className="md:text-lg font-thin sm:font-thin sm:ms-1">
                    Connect instantly with the best service providers
                </Typography.Text>
            </Typography.Text>
            <Row gutter={screens.xs ? [15, 15] : [25, 35]} className="mt-16">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Col xs={24} sm={12} md={8} xl={6} key={index}>
                            <Skeleton active avatar className="min-h-48" />
                        </Col>
                    ))
                ) : filteredData && filteredData.length > 0 ? (
                    filteredData?.map((item, i) => (
                        <Col xs={12} md={8} xl={6} key={item.id}>
                            <ConnectListCard
                                id={item.id}
                                title={item.name}
                                description={item.tagline}
                                image={item.image}
                                offer={item.offer}
                            />
                        </Col>
                    ))
                ) : (
                    <Flex justify="center" className="w-full">
                        <Empty description="No result found" />
                    </Flex>
                )}
            </Row>
        </Content>
    );
};

export default Connect;
