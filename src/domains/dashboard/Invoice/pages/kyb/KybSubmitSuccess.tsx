import React from 'react';

import { Button, Flex, Result, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const KybSubmitSuccess = () => (
    <Content className="flex items-center justify-center h-screen">
        <Flex vertical justify="center" align="center" gap={20} className="pgsuccess">
            <Result
                className="p-0"
                icon={<Lottie options={defaultOptions} height={100} />}
                status="success"
                title="Your KYC has been successfully submitted"
                subTitle={
                    <Flex justify="center">
                        <Typography.Text className="w-3/4">
                            We will review your KYC data submitted by you and you will receive an
                            email with a confirmation once it has been reviewed.
                        </Typography.Text>
                    </Flex>
                }
                extra={[
                    <Flex justify="center" gap={15} key="btn">
                        <Link to="../">
                            <Button type="primary" danger>
                                Go Back
                            </Button>
                        </Link>
                    </Flex>,
                ]}
            />
        </Flex>
    </Content>
);

export default KybSubmitSuccess;
