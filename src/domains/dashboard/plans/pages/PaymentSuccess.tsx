import React, { useEffect, useState } from 'react';

import { Result, Button, Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import useUserInfo from '@src/hooks/useUserInfo';
import { paths } from '@src/routes/paths';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const PaymentSuccess = () => {
    useUserInfo();
    const navigate = useNavigate();
    const location = useLocation();
    const [redirectUrl, setRedirectUrl] = useState(`${paths.dashboard.home}`);
    const [serviceName, setServiceName] = useState(`dashboard`);
    useEffect(() => {
        const storedUrl = sessionStorage.getItem('PurchaseUrl');
        if (storedUrl) {
            const { url, service } = JSON.parse(storedUrl);
            if (url) setRedirectUrl(url);
            if (service) setServiceName(service);
        }
        return () => {
            sessionStorage.removeItem('PurchaseUrl');
        };
    }, []);
    const { packageName } = location.state || {};

    const handleClick = () => {
        navigate(`/${paths.settings.index}`, { state: { activeTab: '2' } });
    };

    const serviceTitles: { [key: string]: string } = {
        Payroll: 'Your payment for Payroll subscription was successful',
        Cloud: 'Your payment for Peko Cloud subscription was successful',
        eSign: 'Your payment for E-sign subscription was successful',
        Collector: 'Your payment for The Collector subscription was successful',
        'WhatsApp For Business': 'Your payment for WhatsApp Business subscription was successful',
        Travel: 'Your payment for Corporate Travel subscription was successful',
        Cards: 'Your payment for Corporate Cards subscription was successful',
        default: 'Payment Successful',
    };
    const serviceLabels: { [key: string]: string } = {
        payroll: 'Payroll',
        Cloud: 'Peko Cloud',
        eSign: 'E-sign',
        Collector: 'The Collector',
        'WhatsApp For Business': 'WhatsApp Business',
        Travel: 'Corporate Travel',
        Cards: 'Corporate Cards',
        default: serviceName,
    };

    const buttonLabel = serviceLabels[serviceName] || serviceLabels.default;

    const title = packageName
        ? `Congratulations, your ${packageName.toLowerCase()} package is activated now`
        : serviceTitles[serviceName] || serviceTitles.default;

    const subTitle = packageName
        ? 'Explore our range of subscription plans to unlock exclusive features and simplify your payments with Peko'
        : 'You will receive a confirmation email shortly.Thank you for choosing Peko.';

    return (
        <Content className="flex items-center justify-center h-screen">
            <Flex vertical justify="center" align="center" gap={20} className="pgsuccess">
                <Result
                    className="p-0"
                    icon={<Lottie options={defaultOptions} height={100} />}
                    status="success"
                    title={title}
                    subTitle={
                        <Flex justify="center">
                            <Typography.Text className="w-3/4">{subTitle}</Typography.Text>
                        </Flex>
                    }
                    extra={[
                        <Flex justify="center" gap={15} key="btn">
                            <Link to={`${redirectUrl}`}>
                                <Button type="primary" danger>
                                    Go to {buttonLabel}
                                </Button>
                            </Link>
                            <Button onClick={handleClick}>View Your Subscription</Button>
                        </Flex>,
                    ]}
                />
            </Flex>
        </Content>
    );
};

export default PaymentSuccess;
