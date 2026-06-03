import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Flex, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

type OrdersHistoryPageProps = {
    ordersList: DataType[];
    setSearchKey: (key: string) => void;
    isLoading: boolean;
};

interface DataType {
    id: string;
    date: JSX.Element;
    documentName: string;
    orderId: string;
    paymentMode: string;
    status: JSX.Element;
    view: JSX.Element;
}

const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({
    ordersList,
    setSearchKey,
    isLoading,
}) => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => formattedDateTime(new Date(date)),
        },
        {
            title: 'Document Type',
            dataIndex: 'documentType',
            key: 'documentName',
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Amount',
            dataIndex: ['transaction', 'order', 'amountInAed'],
            key: 'amount',
            render: (transaction: string) => (
                <Typography.Text className="text-sm text-neutral-600">
                    AED {parseFloat(transaction).toFixed(2)}
                </Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusStyle = {
                    color: '#C89C00',
                    fontWeight: '500',
                };
                if (status.toLowerCase() === 'processing') {
                    statusStyle.color = '#808080';
                }
                if (status.toLowerCase() === 'assigned') {
                    statusStyle.color = '#1EA0CC';
                }
                if (status.toLowerCase() === 'dispatched') {
                    statusStyle.color = '#FF910F';
                }
                if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'delivered') {
                    statusStyle.color = '#26A411';
                }
                if (status.toLowerCase() === 'cancelled') {
                    statusStyle.color = 'red';
                }
                return (
                    <Flex style={statusStyle}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Flex>
                );
            },
        },
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            render: (text: string, record) => (
                <Link
                    to={`${paths.documentAttestation.orderdetails}/${record.orderId}`}
                    style={{ color: '#FF3A3A' }}
                >
                    View Details
                </Link>
            ),
        },
    ];

    return (
        <Flex vertical gap={10}>
            <Flex justify="space-between" align="center">
                <Typography.Text className="text-lg font-medium">Order History</Typography.Text>
                <Input
                    allowClear
                    suffix={<SearchOutlined />}
                    variant="outlined"
                    placeholder="Search"
                    onChange={e => setSearchKey(e.target.value)}
                    style={{ width: 230 }}
                />
            </Flex>
            <Table
                scroll={{ x: 756 }}
                loading={isLoading}
                columns={columns}
                dataSource={ordersList ?? []}
                pagination={false}
            />
        </Flex>
    );
};

export default OrdersHistoryPage;
