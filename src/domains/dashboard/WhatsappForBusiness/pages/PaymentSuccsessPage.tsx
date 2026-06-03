import React, { useEffect, useState } from 'react';

import { Button, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';
import { Link, useNavigate } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import useUserInfo from '@src/hooks/useUserInfo';
import { paths } from '@src/routes/paths';

const { Text } = Typography;

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const PaymentSuccess = () => {
    useUserInfo();
    const navigate = useNavigate();
    const [redirectUrl, setRedirectUrl] = useState(`${paths.dashboard.home}`);

    useEffect(() => {
        const storedUrl = sessionStorage.getItem('PurchaseUrl');
        if (storedUrl) {
            const { url } = JSON.parse(storedUrl);
            setRedirectUrl(url);
        }
        return () => {
            sessionStorage.removeItem('PurchaseUrl');
        };
    }, []);

    // const handleClick = () => {
    //     navigate(`/${paths.settings.index}`, { state: { activeTab: '2' } });
    // };

    return (
        <Content className="flex justify-center items-center bg-white">
            <div className="text-center">
                <div className="mb-6">
                    <Lottie options={defaultOptions} height={100} />
                </div>
                <Text strong className="block text-lg">
                    Your payment for WhatsApp Business subscription was successful
                </Text>
                <Text className="block mt-2 text-base text-gray-600">
                    You will receive a confirmation email shortly. Thank you for choosing Peko.
                </Text>
                <div className="mt-8">
                    <Link to={`${redirectUrl}`}>
                        <Button type="primary" danger className="mr-4">
                            Go to WhatsApp Business
                        </Button>
                    </Link>
                </div>
            </div>
        </Content>
    );
};

export default PaymentSuccess;
