import React from 'react';

import { Button, Col, Flex, Image, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

import LandingPageImg from '@domains/dashboard/WhatsappForBusiness/assets/images/image.png';
import { paths } from '@src/routes/paths';

import useSsoLogin from '../hooks/useSSOLogin';

const Information = () => {
    const { handleSsoLogin, isLoading } = useSsoLogin();

    const handleClick = () => {
        handleSsoLogin();
    };

    return (
        <Content className="xl:px-14">
            <Row className="mt-6">
                <Col xl={12}>
                    <Flex vertical gap={30}>
                        <Typography.Text className="text-3xl font-semibold">
                            Grow Your Business With <br /> WhatsApp
                        </Typography.Text>
                        <Typography.Text className="text-base text-textGreyColor">
                            Streamline customer interactions and enhance engagement with its
                            user-friendly automation capabilities. Create and run cost-effective
                            marketing campaigns, increase sales, and maximize ROI.
                            <br />
                            <br />
                            Take advantage of the platform to scale without investment and
                            accelerate growth.
                        </Typography.Text>

                        <Flex gap={30} className="flex-wrap justify-center sm:justify-start">
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                className="h-10 px-6"
                                size="large"
                                onClick={handleClick}
                                loading={isLoading}
                            >
                                Go to WhatsApp Dashboard
                            </Button>

                            <Link to={paths.whatsappForBusiness.MyProjects}>
                                <Button key="back" className="h-10 px-6" size="large" danger>
                                    My Projects
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
                </Col>
                <Col xl={12} className="justify-center hidden xl:flex">
                    <Image src={LandingPageImg} preview={false} height="18rem" />
                </Col>
            </Row>
        </Content>
    );
};

export default Information;
