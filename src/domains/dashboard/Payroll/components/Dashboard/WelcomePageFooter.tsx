import React from 'react';

import { Col, Flex, Image, Row, Typography } from 'antd';

import footerone from '../../assets/images/dashboardfooterone.png';
import footertwo from '../../assets/images/dashboardfootertwo.png';

const WelcomePageFooter = () => (
    <Flex vertical gap={18} justify="center" align="center" className="md:mt-20">
        <Typography.Text className="font-medium" style={{ fontSize: '1rem' }}>
            Why Peko Payroll?
        </Typography.Text>
        <Row gutter={[0, 17]} className="mt-8">
            <Col
                className="w-[23rem] mt-8"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Image src={footerone} preview={false} height={100} width={140} className="" />
                <Typography.Text
                    className="text-limeGray text-center mt-4"
                    style={{ fontSize: '0.7rem' }}
                >
                    Peko Payroll, a cloud-based payroll management solution, facilitates a seamless
                    payroll experience for employees while optimizing your WPS and Payroll
                    operations.
                </Typography.Text>
            </Col>
            <Col
                className="w-[23rem] mt-8"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Image src={footertwo} preview={false} height={100} width={140} className="pr-2" />
                <Typography.Text
                    className="text-limeGray text-center mt-4"
                    style={{ fontSize: '0.7rem' }}
                >
                    Leave behind your Excel sheets and transition to Peko Payroll software.
                    Duplicate your data and processes seamlessly.
                </Typography.Text>
            </Col>
        </Row>
    </Flex>
);

export default WelcomePageFooter;
