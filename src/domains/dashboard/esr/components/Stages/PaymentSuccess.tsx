import React from 'react';

import { Result, Button, theme, Flex } from 'antd';
import Lottie from 'react-lottie';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import otherSuccess from '@assets/animation/other-success.json';
import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import { paths } from '@src/routes/paths';

interface Props {
    title?: string;
    message?: string;
    isOtherSuccess?: boolean;
    ButtonTxt?: string;
    ButtonLink: string;
}

const PaymentSuccess = ({
    title = 'Success',
    message,
    ButtonTxt,
    isOtherSuccess = false,
    ButtonLink,
}: Props) => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: isOtherSuccess ? otherSuccess : paymentSuccess,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stageId = queryParams.get('stageId');
    const fiscalYear = queryParams.get('fiscalYear');
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
                        height={isOtherSuccess ? 100 : 110}
                        width={isOtherSuccess ? 100 : 110}
                    />
                }
                status="success"
                title={title}
                extra={[
                    <Flex className="justify-center gap-4 -mt-6">
                        <Button
                            onClick={() => {
                                if (stageId === '1') {
                                    navigate(
                                        `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stage1}`,
                                        {
                                            state: {
                                                stageId,
                                                fiscalYear,
                                            },
                                        }
                                    );
                                } else if (stageId === '3') {
                                    navigate(
                                        `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.view}`,
                                        {
                                            state: {
                                                stageId,
                                                fiscalYear,
                                            },
                                        }
                                    );
                                }
                            }}
                            style={{
                                borderColor: 'red',
                                color: 'red',
                            }}
                        >
                            {stageId === '3'
                                ? ' View Return Filling Status'
                                : 'Start ESR Assessment'}
                        </Button>
                        <Link to={`${paths.dashboard.accounting}/${paths.esr.index}`}>
                            <Button
                                style={{
                                    borderColor: 'red',
                                    color: 'red',
                                }}
                            >
                                Go Back
                            </Button>
                        </Link>
                    </Flex>,
                ]}
            />
        </Flex>
    );
};

export default PaymentSuccess;
