import React, { useState } from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Flex, Pagination, Table, TableColumnsType, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import formatString from '@utils/wordFormat';

import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';
import { InsuranceOrder } from '../../types/types';

type Props = {
    searchText: string;
};

const OrdersTable = ({ searchText }: Props) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const { orders, isLoading, count } = useOrderHistoryApi({
        pageSize,
        page: currentPage,
        searchText,
    });

    const columns: TableColumnsType<InsuranceOrder> = [
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (transactionDate: string, record: InsuranceOrder) => {
                const dateTimeString = record?.transactionDate || '';
                const [date, time] = dateTimeString.split(', ');
                return (
                    <Flex vertical>
                        <Flex>{date || ''}</Flex>
                        <Flex>{time || ''}</Flex>
                    </Flex>
                );
            },
        },
        {
            title: 'Order ID',
            dataIndex: 'transactionID',
            key: 'transactionID',
        },
        {
            title: 'Policy Name',
            dataIndex: 'policyName',
            key: 'policyName',
        },
        {
            title: 'Policy Premium',
            dataIndex: 'policyPremium',
            key: 'policyPremium',
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
        },
        {
            title: 'Policy Tenure',
            dataIndex: 'policyTenure',
            key: 'policyTenure',
            render: (policyTenure: string) => <Flex>{policyTenure} Year</Flex>,
        },
        {
            title: 'Status',
            dataIndex: 'insuranceStatus',
            key: 'insuranceStatus',
            render: (insuranceStatus: string, record: InsuranceOrder) => (
                <Flex gap={7}>
                    {formatString(insuranceStatus)}
                    {record?.statusMessage && (
                        <Tooltip title={record?.statusMessage || ''}>
                            <QuestionCircleOutlined className="cursor-pointer" />
                        </Tooltip>
                    )}
                </Flex>
            ),
        },
        {
            title: 'Policy Document',
            dataIndex: 'policydocument',
            key: 'policydocument',
            render: (policydocument: string) =>
                policydocument ? (
                    <Link
                        className="text-green-600 hover:text-green-600 hover:no-underline"
                        target="_blank"
                        to={policydocument}
                    >
                        Download
                    </Link>
                ) : (
                    <Flex>N/A</Flex>
                ),
        },
    ];

    return (
        <Col className="w-full">
            <Flex className="w-full" justify="end" align="end" vertical>
                <Table
                    className="w-full"
                    columns={columns}
                    dataSource={orders}
                    loading={isLoading}
                    pagination={false}
                />
                <Pagination
                    className="mt-4"
                    total={count}
                    current={currentPage}
                    defaultPageSize={pageSize}
                    onChange={(page, pageSize2) => {
                        setCurrentPage(page);
                        setPageSize(pageSize2);
                    }}
                />
            </Flex>
        </Col>
    );
};

export default OrdersTable;
