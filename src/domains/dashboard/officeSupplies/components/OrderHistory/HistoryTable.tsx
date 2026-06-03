import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Flex, Input, Pagination, Table, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';
import { OrderTableItem } from '../../types/orderHistory';

const { officeSupplies } = paths;

const HistoryTable: FC = () => {
    const [searchText, setSearchText] = React.useState<string>('');
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const oneMonthBefore = today.subtract(1, 'month'); // Subtract 1 month
    const oneMonthBeforeFormatted = oneMonthBefore.format('YYYY-MM-DD');

    const { RangePicker } = DatePicker;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [fromDate, setFromDate] = useState<string>(oneMonthBeforeFormatted);
    const [toDate, setToDate] = useState<string>(todayFormatted);
    const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');

    const { orders, isLoading, count } = useOrderHistoryApi({
        from: fromDate,
        to: toDate,
        itemsPerPage: pageSize,
        page: currentPage,
        searchText,
        sort,
    });

    useEffect(() => {
        if (searchText && searchText !== '') {
            setCurrentPage(1);
        }
    }, [searchText]);

    const handleDateChange = (
        dates: [Dayjs | null, Dayjs | null],
        dateStrings: [string, string]
    ) => {
        if (dates && dates[0] && dates[1]) {
            setFromDate(dates[0].format('YYYY-MM-DD'));
            setToDate(dates[1].format('YYYY-MM-DD'));
        } else {
            setFromDate(
                new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
            );
            setToDate(new Date().toISOString().substring(0, 10));
        }
        setCurrentPage(1); // Reset to the first page whenever the date range changes
    };

    const disabledDate = (current: Dayjs): boolean =>
        // Can not select days after today
        current && current > dayjs().endOf('day');
    const generatePaymentStatusBtn = (status: string) => {
        const statusColors: Record<string, { badgeColor: string; textColor: string }> = {
            PENDING: { badgeColor: '#FFF4F3', textColor: '#CD9300' },
            CONFIRMED: { badgeColor: '#FFF4CD', textColor: '#CD9300' },
            INPROGRESS: { badgeColor: '#E3F5FF', textColor: '#54AEE1' },
            SHIPPED: { badgeColor: '#EAFFF7', textColor: '#51B18D' },
            COMPLETED: { badgeColor: '#EBFFE7', textColor: '#26A411' },
            CANCELLED: { badgeColor: '#E9E9E9', textColor: '#D7341E' },
            'RETURN REQUESTED': { badgeColor: '#FFF4F3', textColor: '#D7341E' },
            'RETURN REJECTED': { badgeColor: '#E9E9E9', textColor: '#000000' },
            'RETURN INITIATED': { badgeColor: '#E3F5FF', textColor: '#54AEE1' },
            'RETURN COMPLETED': { badgeColor: '#EBFFE7', textColor: '#26A411' },
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
                {status === 'inprogress' ? 'In Progress' : status}
            </Typography.Text>
        );
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string, record: OrderTableItem) => formattedDateTime(new Date(date)),
            width: '10%',
        },
        {
            title: 'Product Name',
            dataIndex: 'products',
            key: 'products',
            render: (products: any[], record: OrderTableItem) => {
                if (!Array.isArray(products) || products.length < 1) {
                    return '-';
                }
                return (
                    <Flex gap={10} vertical>
                        {products.map((v, i) => (
                            <Flex key={i}>{v?.productName}</Flex>
                        ))}
                    </Flex>
                );
            },
            width: '40%',
        },
        {
            title: 'Order ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
            width: '15%',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
            render: (status: string) => (
                <Typography.Text className="text-sm text-neutral-600">
                    AED {parseFloat(status).toFixed(2)}
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
        {
            title: 'Actions',
            key: 'view',
            render: (text: string, record: OrderTableItem) => (
                <Link
                    to={`/${officeSupplies.index}/${officeSupplies.orderHistory}/${officeSupplies.orderDetails}/${record.id}`}
                    style={{ color: '#FF3A3A' }}
                >
                    View Details
                </Link>
            ),
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
                            onChange={handleSearchChange}
                        />
                    </Flex>
                    <RangePicker
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                        value={[dayjs(fromDate), dayjs(toDate)]}
                        className="ml-2"
                        disabledDate={disabledDate}
                    />
                </Flex>
            </Flex>
            <Table
                scroll={{ x: 756 }}
                loading={isLoading}
                dataSource={orders.map(order => ({ ...order, key: order.transactionId }))}
                columns={columns}
                pagination={false}
            />
            <Pagination
                className="mt-10 text-center sm:text-end"
                total={count}
                current={currentPage}
                defaultPageSize={pageSize}
                onChange={(page, pageSize2) => {
                    setCurrentPage(page);
                    setPageSize(pageSize2);
                }}
            />
        </>
    );
};

export default HistoryTable;
