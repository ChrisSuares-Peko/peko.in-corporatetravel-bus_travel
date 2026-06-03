import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Grid, Input, Row, Table, Typography, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useBulkHelpers from '../../hooks/beneficiary/useBulkHelpers';
import useBulkPayment from '../../hooks/beneficiary/useBulkPayApis';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';
import { beneficiaryBalanceColumn } from '../../utils/tableColumn';

const BulkPayReview = () => {
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item ? item.vendor : null;
    const { limitData } = useFetchLimitApi(serviceData ? serviceData?.path : '');
    const navigate = useNavigate();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { bulkPaymentApi, isbulkLoading } = useBulkPayment({ limitDetails: limitData });
    const {
        amounts,
        bulkBalanceDataArray,
        handleAmountChange,
        handleSearch,
        rowSelection,
        searchValue,
        selectedRows,
        totalAmount,
        inputValidity,
        inputTouched,
    } = useBulkHelpers({ limitData });

    return (
        <Row>
            <Col span={24} className="w-full">
                <Flex align="center" gap={15}>
                    <ReactSVG src={serviceData ? serviceData?.icon : ''} height={50} />
                    <Typography.Text className="text-lg font-medium">
                        {serviceData ? serviceData?.title : ''}
                    </Typography.Text>
                </Flex>
            </Col>
            <Col span={24} className="w-full h-[30rem] sm:h-[26rem] overflow-x-auto">
                {limitData && bulkBalanceDataArray ? (
                    <Table
                        rowSelection={rowSelection}
                        columns={beneficiaryBalanceColumn(
                            amounts,
                            handleAmountChange,
                            inputValidity,
                            inputTouched,
                            screens,
                            limitData
                        )}
                        dataSource={bulkBalanceDataArray.map(data => ({
                            ...data,
                            key: data.data.id,
                        }))}
                        pagination={false}
                        title={() => (
                            <Row justify="end" className="mb-">
                                <Col sm={6} xs={24}>
                                    <Input
                                        placeholder="Search beneficiary"
                                        className="text-sm sm:text-base"
                                        addonAfter={<SearchOutlined />}
                                        allowClear
                                        type="text"
                                        minLength={8}
                                        maxLength={20}
                                        value={searchValue}
                                        onChange={e => handleSearch(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        )}
                        rowClassName={record =>
                            !record.status ? 'cursor-not-allowed  opacity-50' : ''
                        }
                    />
                ) : (
                    <Skeleton paragraph={{ rows: 8 }} className="mt-10" />
                )}
            </Col>
            <Flex className="w-full px-5 mt-3" justify="space-between">
                <Typography.Text className="text-lg sm:text-2xl font-semibold">
                    Amount
                </Typography.Text>
                <Typography.Text className="text-lg sm:text-2xl font-semibold ">
                    AED {formatNumberWithLocalString(totalAmount)}
                </Typography.Text>
            </Flex>
            <Flex justify="end" className="w-full mt-5" gap={30}>
                <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    danger
                    className="px-10 h-10"
                    loading={isbulkLoading}
                    onClick={() =>
                        bulkPaymentApi(totalAmount, amounts, selectedRows, inputValidity)
                    }
                >
                    Pay AED {formatNumberWithLocalString(totalAmount)}
                </Button>
                <Button className="px-14 h-10" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </Flex>
        </Row>
    );
};

export default BulkPayReview;
