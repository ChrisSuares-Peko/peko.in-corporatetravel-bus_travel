import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Flex, Input, TableColumnsType, Pagination } from 'antd';

// eslint-disable-next-line import/order
import useFilter from '@src/domains/dashboard/GiftCards/hooks/useFilter';

// import { formattedDateOnly } from '@utils/dateFormat';

import { formattedDateTime } from '@utils/dateFormat';
import formatString from '@utils/wordFormat';

import { useOrderHistoryTable } from '../hooks/useOrderHistoryTable';
import { OrderHistoryTableData, filterState } from '../types/types';

type OrderHistoryPageProps = {};

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = () => {
    const initialValues = {
        search: '',
        start: 0,
        length: 10,
        draw: 1,
    };
    const [filter, setFilter] = useState<filterState>(initialValues);
    const { handleSearch, handlePageChange } = useFilter({ setFilter });
    const { data, isLoading, count } = useOrderHistoryTable(
        filter.draw,
        filter.start,
        filter.length,
        filter.search
    );

    const OrderHistoryColumns: TableColumnsType<OrderHistoryTableData> = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date: Date) => formattedDateTime(new Date(date)),
        },
        {
            title: 'Gift Card Name',
            dataIndex: 'giftCardName',
        },
        {
            title: 'Order ID',
            dataIndex: 'txnId',
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            render: (orderType: string) => orderType ?? '-',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: (quantity: string) => quantity ?? '-',
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            render: (text: string) => <span>{formatString(text)}</span>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'amount',
            render: (amount: number) => (
                <Typography.Text>AED {Number(amount).toFixed(2)}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text: string) => (
                <span
                    className={`${text === 'SUCCESS' ? 'text-textGreen' : 'text-bgOrange2'} capitalize`}
                >
                    {text.toLowerCase()}
                </span>
            ),
        },
    ];

    function formattedDateOnly(date: Date): string {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `${monthName} ${day}-${year} ${time}`;
    }
    return (
        <Flex vertical gap={20}>
            {/* <Row justify="space-between" align="middle" gutter={[20, 20]}>
                <Col xs={24} sm={12} md={6}>
                    <Typography.Text className="text-lg font-medium xl:text-xl lg:text-lg sm:text-lg ">
                        Order History
                    </Typography.Text>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Search for orders"
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={100}
                        value={filter.search}
                        onChange={handleSearch}
                    />
                </Col>
            </Row> */}
            <Flex justify="space-between">
                <Typography.Paragraph className={`text-xl  font-medium `}>
                    Order History
                </Typography.Paragraph>
                <Flex align="center">
                    <Input
                        placeholder="Search"
                        allowClear
                        suffix={<SearchOutlined />}
                        variant="outlined"
                        style={{
                            width: 'calc(100% - 10px)',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        value={filter.search}
                        onChange={handleSearch}
                    />
                </Flex>
            </Flex>
            <Table
                columns={OrderHistoryColumns}
                dataSource={data.map(item => ({ ...item, key: item.txnId }))}
                loading={isLoading}
                pagination={false}
            />
            <Pagination
                current={filter.start}
                onChange={handlePageChange}
                size="default"
                className="text-end pt-7"
                total={count}
            />
        </Flex>
    );
};

export default OrderHistoryPage;
