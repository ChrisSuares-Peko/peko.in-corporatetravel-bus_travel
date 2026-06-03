import React from 'react';

import { Col, Divider, Flex, Grid, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';

import BenefitList from '../components/BenefitList';
import FeatureCard from '../components/FeatureCard';
import PekoClubHeader from '../components/PekoClubHeader';
import { featureRow } from '../utils/data';

const HomePage = () => {
    const screens = Grid.useBreakpoint();
    return (
        <Content className="w-full  xxl:flex justify-center">
            <Flex vertical className="w-fit">
                <PekoClubHeader />
                <BenefitList />
                <Content className="px-0 mt-9">
                    <Flex className=" text-[1.25rem] ">Explore</Flex>
                    <Divider className="h-1" />
                    <Row gutter={screens.xs ? [20, 20] : [20, 40]} className="mt-10">
                        {featureRow.map((item, i) => (
                            <Col key={i} xs={6} sm={6} md={3} lg={6} xl={3} xxl={3}>
                                <FeatureCard icon={item.image} title={item.title} />
                            </Col>
                        ))}
                    </Row>
                </Content>
            </Flex>
        </Content>
    );
};

export default HomePage;
