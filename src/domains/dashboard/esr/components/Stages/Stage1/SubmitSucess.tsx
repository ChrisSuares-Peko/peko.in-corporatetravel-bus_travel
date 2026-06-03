import React from 'react';

import { Result, Button, theme, Flex } from 'antd';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

import otherSuccess from '@assets/animation/other-success.json';
import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import { paths } from '@src/routes/paths';

interface Props {
    title?: string;
    message?: string;
    isOtherSuccess?: boolean;
    ButtonTxt?: string;
}

const SuccessScreen = ({ title = 'data', message, ButtonTxt, isOtherSuccess = false }: Props) => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: isOtherSuccess ? otherSuccess : paymentSuccess,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <Flex vertical justify="center" align="center" gap={30}>
            <Result
                className="md:w-4/6 p-0"
                icon={
                    <Lottie
                        options={defaultOptions}
                        height={isOtherSuccess ? 10 : 110}
                        width={isOtherSuccess ? 10 : 110}
                    />
                }
                status="success"
                title="Your ESR Assessment is Submitted"
                subTitle={
                    message ??
                    'A representative from SS&CO will review the assessment and get in touch with you shortly.'
                }
                extra={[
                    <Link to={`${paths.dashboard.accounting}/${paths.esr.index}`} key="backBtn">
                        <Button danger>Go to ESR dashboard</Button>
                    </Link>,
                ]}
            />
        </Flex>
    );
};

export default SuccessScreen;
