import React from 'react';

import { Card, Col, Empty, Flex, Image, Typography, theme } from 'antd';

interface About {
    name?: string;
    productImage?: string;
    description?: string;
}

function AboutSection({ name, productImage, description }: About) {
    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <>
            <Col xs={24} md={8}>
                <Card bordered className="h-full rounded-xl flex justify-center items-center">
                    <Flex vertical gap={6} align="center">
                        {productImage ? (
                            <Flex
                                className="w-40 sm:w-28 rounded-2xl sm:rounded-3xl"
                                align="center"
                                justify="center"
                            >
                                <Image preview={false} className="w-24" src={productImage} />
                            </Flex>
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>No Preview Available</span>}
                            />
                        )}
                    </Flex>
                </Card>
            </Col>
            <Col xs={24} md={16}>
                <Flex vertical gap={15}>
                    <Typography.Title className="text-xl" style={{ color: colorPrimary }} level={3}>
                        {name}
                    </Typography.Title>
                    <Typography.Title level={5}>About Product</Typography.Title>
                    <Typography.Text style={{ lineHeight: '2rem', fontSize: '0.875rem' }}>
                        {description}
                    </Typography.Text>
                    {/* <Typography.Text disabled style={{ fontSize: '0.875rem' }}>
                        Includes: Contact support via chat or phone at no extra cost throughout your
                        subscription
                    </Typography.Text> */}
                </Flex>
            </Col>
        </>
    );
}

export default AboutSection;
