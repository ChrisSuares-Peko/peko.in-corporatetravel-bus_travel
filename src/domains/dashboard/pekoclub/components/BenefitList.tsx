import React from 'react';

import { Col, Divider, Flex, Row, Typography } from 'antd';

import BenefiteCard from './BenefiteCard';
import { benefiteRow } from '../utils/data';

const BenefitList = () => (
    <>
        <Flex justify="space-between" className="mt-5">
            <Typography.Text className="text-xl">Peko Membership Benefits</Typography.Text>
            <Flex className="mt-2">
                <Typography.Text className="text-sm text-bgOrange2 font-medium mr-2 xxl:mr-7">
                    See More
                </Typography.Text>
            </Flex>
        </Flex>
        <Divider />
        <Row>
            {benefiteRow.map((item, i) => (
                <Col key={i} span={4} className="mt-8">
                    <BenefiteCard image={item.image} title={item.title} />
                    {/* <Image src={item.image} className="ml-11" width={70} height={70} preview={false}/> */}
                    {/* <Typography.Text className='px-12'>
                        {item.title}
                       </Typography.Text> */}
                </Col>
            ))}
        </Row>
    </>
);

export default BenefitList;
