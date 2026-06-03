import React from 'react';

import { Result, Button, Flex } from 'antd';
import Lottie from 'react-lottie';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import PaymentTable from '../components/PaymentTable';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const PaymentSuccess = () => {
    const dispatch = useAppDispatch();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status')?.replace(/["']/g, '');
    const transactionId = queryParams.get('transactionId');
    const navigate = useNavigate();

    return (
        <Flex vertical justify="center" align="center" gap={20} className="pgsuccess">
            <Result
                className="md:w-3/6  p-0"
                icon={<Lottie options={defaultOptions} height={100} />}
                status="success"
                title="Payment Link Created"
                extra={[
                    <Flex justify="center" gap={15} key="btn">
                        <Link to={`${paths.dashboard.home}`}>
                            <Button type="primary" danger>
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link to={`/${paths.invoice.index}`}>
                            <Button>Go to Collector</Button>
                        </Link>
                        {/* <Link to={`/${secondBtnLink}`}>
                                <Button>{secondButtonTxt || 'View Transaction'} </Button>
                            </Link> */}
                    </Flex>,
                    // ),
                ]}
            />
            <PaymentTable />
            {/* {shouldRenderTable && <PaymentResultTable paymentData={tableData} />} */}
        </Flex>
    );
};

export default PaymentSuccess;
