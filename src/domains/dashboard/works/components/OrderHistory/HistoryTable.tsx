import type { FC } from 'react';
import { useState } from 'react';

import { Pagination, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';
import { OrderTableItem } from '../../type/orderHistory';

const { works } = paths;
interface HistoryTableProps {
    searchText?: string | null;
}

const HistoryTable: FC<HistoryTableProps> = ({ searchText }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [fromDate, setFromDate] = useState<string>('2000-01-01');
    const [toDate, setToDate] = useState<string>(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    );
    const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');

    const { orders, isLoading, count } = useOrderHistoryApi({
        from: fromDate,
        to: toDate,
        itemsPerPage: pageSize,
        page: currentPage,
        searchText,
        sort,
    });
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string, record: OrderTableItem) => formattedDateTime(new Date(date)),
            width: '10%',
            // sorter: (a: OrderTableItem, b: OrderTableItem) =>
            //     sort === 'DESC' ? setSort('ASC') : setSort('DESC')
        },
        {
            title: 'Work Name',
            dataIndex: 'workName',
            key: 'workName',
            width: '25%',
        },
        {
            title: 'Plan Name',
            dataIndex: 'planName',
            key: 'planName',
            width: '25%',
        },
        {
            title: 'Order ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
            width: '10%',
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
            render: (status: string) => {
                let statusStyle = {
                    color: '#C89C00',
                    fontWeight: '500',
                };
                if (status.toLowerCase() === 'pending') {
                    statusStyle = {
                        color: '#C89C00',
                        fontWeight: '500',
                    };
                }
                if (status.toLowerCase() === 'completed') {
                    statusStyle = {
                        color: '#26A411',
                        fontWeight: '500',
                    };
                }
                if (status.toLowerCase() === 'onprogress') {
                    statusStyle = {
                        color: '#54AEE1',
                        fontWeight: '500',
                    };
                }
                return (
                    <Typography.Text style={statusStyle} className="capitalize">
                        {status.toLowerCase() === 'onprogress'
                            ? 'in progress'
                            : status.toLowerCase()}
                    </Typography.Text>
                );
            },
            width: '10%',
        },
        {
            title: 'View',
            key: 'view',
            render: (text: string, record: OrderTableItem) => (
                <Link
                    to={`${paths.dashboard.works}/${works.orderHistory}/${works.orderDetails}/${record.id}`}
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
            <Table
                scroll={{ x: 756 }}
                loading={isLoading}
                dataSource={orders}
                columns={columns}
                pagination={false}
            />

            <Pagination
                className="sm:text-end text-center mt-10 "
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
