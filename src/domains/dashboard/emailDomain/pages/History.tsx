import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Table, Typography, Pagination } from 'antd';
import { capitalize } from 'lodash';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { useGetEmailDomainHistoryApi } from '../hooks/useGetEmailDomainHistoryApi';

const EmailDomainHistory = () => {
    const {
        historyData,
        total,
        isLoading,
        page,
        setPage,
        pageSize,
        setPageSize,
        searchText,
        setSearchText,
    } = useGetEmailDomainHistoryApi();

    const generatePaymentStatusBtn = (status: string) => {
        const statusColors: Record<string, { badgeColor: string; textColor: string }> = {
            SUCCESS: { badgeColor: '#EBFFE7', textColor: '#26A411' },
            FAILURE: { badgeColor: '#FFF4F3', textColor: '#D7341E' },
        };

        const { badgeColor, textColor } = statusColors[status.toUpperCase()] || {
            badgeColor: 'gray',
            textColor: 'white',
        };

        return (
            <Typography.Text
                className="capitalize"
                style={{
                    fontWeight: 500,
                    color: textColor,
                }}
            >
                {status}
            </Typography.Text>
        );
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '10%',
            render: (date: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(date))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(date))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Product Name',
            dataIndex: ['emailDomain', 'softwares_subscription'],
            key: 'emailDomain',
            width: '10%',
            render: (data: any) => data?.name ?? '-',
        },
        {
            title: 'Plan Name',
            dataIndex: ['emailDomain', 'name'],
            key: 'emailDomain',
            width: '10%',
        },
        {
            title: 'Order ID',
            dataIndex: 'corporateTxnId',
            key: 'corporateTxnId',
            width: '10%',
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
            width: '10%',
            render: (data: any) => <Typography.Text>{capitalize(data) ?? '-'}</Typography.Text>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: '15%',
            render: (totalAmount: string) => (
                <Typography.Text className="text-sm text-neutral-600">
                    AED {parseFloat(totalAmount).toFixed(2)}
                </Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => generatePaymentStatusBtn(status.toLowerCase()),
            width: '10%',
        },
    ];
    return (
        <>
            <Flex justify="space-between" className="my-1">
                <Typography.Paragraph className="text-xl font-medium">
                    Order History
                </Typography.Paragraph>
                <Flex>
                    <Flex align="center">
                        <Input
                            placeholder="Search"
                            allowClear
                            suffix={<SearchOutlined />}
                            style={{
                                width: 'calc(100% - 10px)',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Table
                scroll={{ x: 756 }}
                loading={isLoading}
                dataSource={historyData}
                columns={columns}
                pagination={false}
            />
            <Pagination
                className="mt-10 text-center sm:text-end"
                total={total}
                current={page}
                pageSize={pageSize}
                onChange={(newPage, newPageSize) => {
                    setPage(newPage);
                    setPageSize(newPageSize);
                }}
            />
        </>
    );
};

export default EmailDomainHistory;
