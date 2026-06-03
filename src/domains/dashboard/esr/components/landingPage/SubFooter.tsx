import React from 'react';

import { Row, Col, Typography, Flex, Space, Divider } from 'antd';

const { Paragraph, Text, Link } = Typography;

const SubFooter = () => (
    <Flex vertical>
        <Divider className="my-10 w-full" />
        <Row gutter={[16, 16]} justify="center">
            <Col xs={24} className="text-center">
                <Space direction="vertical">
                    <Paragraph className="text-[18px] md:text-[22px] font-bold text-greyHead mb-8">
                        Stay Compliant and Focus on Business Growth with Peace of Mind
                    </Paragraph>

                    <Paragraph className="text-textLightGray text-[13px] md:text-[14px] ">
                        Submit ESR notification and report in time and ensure that your business
                        remains compliant with the regulations established by the UAE government.
                        Start the process now and we are here to help you through every step of your
                        journey.
                    </Paragraph>
                    <Paragraph className="text-textLightGray text-[13px] md:text-[14px]">
                        {' '}
                        Visit the official government website to know more:
                        <Link
                            href="https://www.moec.gov.ae/en/economic-substance-regulations"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Text className="text-[13px] md:text-[16px] underline text-textLightGray">
                                {' '}
                                www.moec.gov.ae/en/economic-substance-regulations
                            </Text>
                        </Link>
                    </Paragraph>

                    <Divider className="hidden my-30" />
                </Space>
            </Col>
        </Row>
    </Flex>
);

export default SubFooter;
