import React from 'react';

import { Col, Flex, Grid, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { useAppSelector } from '@src/hooks/store';

import BulkBenificiariesList from '../components/beneficiary/BulkBeneficiariesList';
import BulkBillDetailsForm from '../components/forms/BulkBillDetailsForm';
import { useFetchLimitApi } from '../hooks/useFetchLimitApi';

const BulkPaymentDetailPage = () => {
    const item = useAppSelector(state => state.reducer.billPayment).vendor;
    const { limitData, isLoading } = useFetchLimitApi(item ? item?.path : '');
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Row>
            <Col xl={13} xxl={14} className="w-full xl:sticky xl:top-0 h-fit">
                <Flex align="center" gap={15} className="mb-10">
                    {item && <ReactSVG src={item.icon} height={screens.xs ? 40 : 60} />}
                    <Typography.Text className="text-lg font-medium">
                        {item ? item.title : ''}
                    </Typography.Text>
                </Flex>
                <BulkBillDetailsForm limitData={limitData!} isLoading={isLoading} />
            </Col>
            <Col
                xl={11}
                xxl={10}
                className="w-full sm:bg-gray-50 rounded-3xl sm:p-6 mt-10 sm:mt-5 xl:mt-0"
            >
                <BulkBenificiariesList limitData={limitData!} />
            </Col>
        </Row>
    );
};
export default BulkPaymentDetailPage;
