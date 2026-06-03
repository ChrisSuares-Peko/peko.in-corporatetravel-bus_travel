import React from 'react';

import { Typography, Space, List, Col } from 'antd';

const { Text, Paragraph } = Typography;

const ESRContent = () => (
    <Col xs={24} md={14}>
        <Space direction="vertical" className="ml-18">
            <Text className="text-xl md:text-base lg:text-3xl font-bold text-lightBlack mb-8">
                ESR Compliance Services
            </Text>
            <Paragraph className="text-textLightGray text-[12px] md:text-[15px] my-4">
                Welcome to the ESR (Economic Substance Regulations) page. We provide ESR compliance
                services in partnership with SS&amp;Co. Our collaboration with SS&amp;Co, one of the
                world&apos;s leading professional services networks, ensures that your information
                is reviewed by experts, providing you with accurate and reliable results.
            </Paragraph>
            <Text className="text-[14px] md:text-[18px] font-medium text-cardHTitleText mb-4">
                What is ESR?
            </Text>
            <Paragraph className="text-[12px] md:text-[15px] text-textLightGray">
                Complying with ESR is crucial for: Legal compliance and avoiding fines,
                Demonstrating genuine economic activities in the UAE, Maintaining a positive
                reputation and trust with stakeholders.
            </Paragraph>
            <Text className="text-[14px] md:text-[18px] font-medium text-cardHTitleText mb-4">
                ESR filing is crucial for:
            </Text>
            <List
                dataSource={[
                    'Regulatory compliance and avoiding penalties',
                    'Aligning with international standards and requirements',
                    'Maintaining a positive reputation and trust with stakeholders',
                ]}
                renderItem={item => (
                    <List.Item
                        style={{ padding: 0, border: 'none', marginBottom: '4px' }}
                        className="text-[13px] md:text-[16px] text-textLightGray flex items-start"
                    >
                        <Text className="mr-2 ml-3 text-[12px] md:text-[15px] text-textLightGray ">
                            &bull;
                        </Text>
                        <Text className="flex-1 text-[12px] md:text-[15px] text-textLightGray">
                            {item}
                        </Text>
                    </List.Item>
                )}
            />
        </Space>
    </Col>
);

export default ESRContent;
