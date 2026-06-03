import React, { useEffect, useState } from 'react';

import { Result, Button, Flex, Skeleton, Table } from 'antd';
import Lottie from 'react-lottie';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import paymentSuccess from '@assets/animation/paymentSuccess2.json';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { resetLogisticsDataState } from '../../logistics/slice/logisticsSlice';
import PaymentResultTable from '../components/PaymentResultTable';
import useBulkPaymentStatusUpdate from '../hooks/useBulkPaymentStatusUpdate';
import useGetTransactionData from '../hooks/useGetTransactionData';
import { resetPaymentData } from '../slices/payment';
import { BulkPaymentResp } from '../types';
import { BulkUploadColumn } from '../utils/tableColumn';
import { getSuccessPageData } from '../utils/utils';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccess,
};

const PaymentSuccess = () => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status')?.replace(/["']/g, '');
    const transactionId = queryParams.get('transactionId');
    const serviceName = queryParams.get('serviceName');
    const bulkPaymentDataString = queryParams.get('bulkPaymentData');
    const [bulkPaymentData, setBulkPaymentData] = useState<BulkPaymentResp[]>([]);
    const navigate = useNavigate();
    const { transactionData, isLoading } = useGetTransactionData(transactionId);

    useEffect(() => {
        dispatch(resetPaymentData());
        dispatch(resetLogisticsDataState());
        if (status !== 'success') {
            navigate(paths.dashboard.home);
        }
        if (bulkPaymentDataString) {
            const parsedData = JSON.parse(decodeURIComponent(bulkPaymentDataString));
            if (serviceName==="esim"){
                parsedData[0]["serviceName"]="esim"
            }
            setBulkPaymentData(parsedData);
        }
    }, [dispatch, status, transactionId, navigate, bulkPaymentDataString]);

    useBulkPaymentStatusUpdate(
        id,
        role,
        bulkPaymentData[0]?.batchId,
        bulkPaymentData,
        setBulkPaymentData
    );

    const serviceSuccessData = getSuccessPageData(transactionData, bulkPaymentData);
    const {
        title,
        message,
        firstButtonTxt,
        secondButtonTxt,
        firstBtnLink = '/dashboard',
        secondBtnLink = '/reports',
    } = serviceSuccessData || {};

    const { transactionDate, corporateTxnId, serviceOperator, amountInAed, paymentMode } =
        transactionData || {};
    let tableServiceProvider = serviceOperator?.serviceProvider;
    if (serviceOperator?.serviceProvider === 'Dubai DED') tableServiceProvider = 'License Renewal';
    const tableData = {
        transactionDate,
        corporateTxnId,
        serviceProvider: tableServiceProvider,
        amount: amountInAed,
        paymentMode,
    };
    const shouldRenderTable = Object.values(tableData).every(value => value !== undefined);

    return (
        <Flex vertical justify="center" align="center" gap={20} className="pgsuccess">
            <Result
                className="p-0 md:w-3/6"
                icon={<Lottie options={defaultOptions} height={100} />}
                status="success"
                title={!isLoading && title}
                subTitle={
                    isLoading ? (
                        <Skeleton
                            style={{ minWidth: 400, height: 10 }}
                            paragraph={{ rows: 2 }}
                            active
                        />
                    ) : (
                        message
                    )
                }
                extra={[
                    isLoading ? (
                        <Skeleton.Button
                            key="skeleton"
                            style={{ minWidth: 400, height: 30 }}
                            active
                        />
                    ) : (
                        <Flex justify="center" gap={15} key="btn">
                            <Link to={`${firstBtnLink}`}>
                                <Button type="primary" danger>
                                    {firstButtonTxt || 'Go to dashboard'}
                                </Button>
                            </Link>
                            <Link to={`${secondBtnLink}`}>
                                <Button>{secondButtonTxt || 'View Transaction'} </Button>
                            </Link>
                        </Flex>
                    ),
                ]}
            />
            {shouldRenderTable && <PaymentResultTable paymentData={tableData} />}
            {bulkPaymentData.length > 0 && (
                <Table
                    className="mt-7"
                    scroll={{ x: 882 }}
                    dataSource={bulkPaymentData}
                    columns={BulkUploadColumn()}
                    pagination={false}
                />
            )}
        </Flex>
    );
};

export default PaymentSuccess;
