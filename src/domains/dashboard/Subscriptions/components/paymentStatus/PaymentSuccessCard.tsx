import React from 'react';

import { Card, Col, Flex, Image, Row, Typography } from 'antd';

// import AdobeImage from '@domains/dashboard/Subscriptions/assets/icons/Adobe.png';
import { useAppSelector } from '@src/hooks/store';

type Props = {};

const PaymentSuccessCard = (props: Props) => {
    const { subscriptionDetails } = useAppSelector(state => state.reducer.subscription);
    return (
        <Col xs={24} md={16} className="pt-7">
            <Card className="border-2 rounded-2xl">
                <Row gutter={[30, 20]}>
                    <Col xs={24} md={8} className="mt-3">
                        <Flex vertical gap={20} align="center" justify="center">
                            <Flex
                                className={` w-40 sm:w-32 rounded-2xl sm:rounded-3xl `}
                                align="center"
                                justify="center"
                            >
                                <Image
                                    preview={false}
                                    style={{ width: '8rem' }}
                                    className="w-40 object-contain"
                                    src={subscriptionDetails?.data?.productImage}
                                />
                            </Flex>
                            <Typography.Text className="xl:text-xl lg:text-lg  sm:text-lg text-lg font-medium ">
                                {subscriptionDetails?.data?.name}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={24} md={16}>
                        <Flex vertical gap={15}>
                            <Typography.Paragraph className="text-start">
                                Get the apps and services you need for all kinds of creative work,
                                from photography and graphic design to video, UI/UX, and social
                                media.
                            </Typography.Paragraph>
                            <Row gutter={5} className="text-start">
                                <Col span={12} className="font-thin">
                                    Current payment plan:
                                </Col>
                                <Col span={12}>US$ 83.46/mo</Col>
                                <Col span={12} className="font-thin">
                                    Licences:
                                </Col>
                                <Col span={12}>1 Licence</Col>
                                <Col span={12} className="font-thin">
                                    Billing Cycle:
                                </Col>
                                <Col span={12}>Yearly</Col>
                                <Col span={12} className="font-thin">
                                    Company :
                                </Col>
                                <Col span={12}>Savoll FZ LLC, UAE</Col>
                            </Row>
                            <Typography.Paragraph className="text-textGreen text-start">
                                Activation Code will be sent to your email
                            </Typography.Paragraph>
                        </Flex>
                    </Col>
                </Row>
            </Card>
            <Flex justify="center" className="pt-7">
                <Typography.Text>
                    For any queries or support, please contact us at support@peko.one
                </Typography.Text>
            </Flex>
        </Col>
    );
};

export default PaymentSuccessCard;
