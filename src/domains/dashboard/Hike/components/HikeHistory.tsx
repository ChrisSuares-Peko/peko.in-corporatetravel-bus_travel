import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Table, Typography, Pagination } from 'antd';
import dayjs from 'dayjs';

import { useGetHikeHistoryApi } from '../hooks/useGetHikeHistoryApi';

const HikeHistory = () => {
    const {
        hikeHistoryData,
        total,
        isLoading,
        page,
        setPage,
        pageSize,
        setPageSize,
        searchText,
        setSearchText,
    } = useGetHikeHistoryApi();

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
            render: (date: string) => dayjs(date).format('MMMM D, YYYY'),
            width: '10%',
        },
        {
            title: 'Name',
            dataIndex: 'hikes',
            key: 'hikes',
            width: '20%',
            render: (hikes: any[]) => (
                <ul>
                    {hikes.map((hike, index) => (
                        <li key={index}>
                            {index + 1}. {hike.name}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'No. of orders',
            dataIndex: 'hikes',
            key: 'hikes',
            width: '10%',
            render: (hikes: any[]) => (
                <ul>
                    {hikes.map((hike, index) => (
                        <li key={index}>{hike.quantity}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Amount per user',
            dataIndex: 'hikes',
            key: 'hikes',
            width: '15%',
            render: (hikes: any[]) => (
                <ul>
                    {hikes.map((hike, index) => (
                        <li key={index}>AED {parseFloat(hike?.price).toFixed(2)}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Amount per Voucher',
            dataIndex: 'hikes',
            key: 'hikes',
            width: '15%',
            render: (hikes: any[]) => (
                <ul>
                    {hikes.map((hike, index) => (
                        <li key={index}>AED {parseFloat(hike?.totalPrice).toFixed(2)}</li>
                    ))}
                </ul>
            ),
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
                dataSource={hikeHistoryData}
                columns={columns}
                pagination={false}
            />
            <Pagination
                className="sm:text-end text-center mt-10"
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

export default HikeHistory;
