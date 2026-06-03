import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Grid, Pagination, Table, Typography } from 'antd';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import { SortDirection } from '@customtypes/general';
import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import OrdersMobile from './OrdersMobile';
import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';
import { OrderTableItem } from '../../types/orderHistory';

const { logistics } = paths;
interface HistoryTableProps {
    searchText?: string | null;
}

const HistoryTable: FC<HistoryTableProps> = ({ searchText }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText || '');
    const [sort, setSort] = useState<SortDirection>(SortDirection.DESC);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const debouncedSearch = debounce((searchQuery: string) => {
        setDebouncedSearchText(searchQuery || '');
    }, 500);

    useEffect(() => {
        if (searchText && searchText.trim() !== '') {
            setCurrentPage(1);
        }
        debouncedSearch(searchText || '');
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const { orders, isLoading, count } = useOrderHistoryApi({
        itemsPerPage: pageSize,
        page: currentPage,
        search: debouncedSearchText,
        sort,
    });
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string, record: OrderTableItem) => formattedDateTime(new Date(date)),
        },
        {
            title: 'Shipment Type',
            dataIndex: 'shipmentType',
            key: 'shipmentType',
        },
        {
            title: 'Pickup Reference',
            dataIndex: 'pickupReference',
            key: 'pickupReference',
        },
        {
            title: 'AWB Bill Number',
            dataIndex: 'AWBNumber',
            key: 'AWBNumber',
        },
        {
            title: 'Order ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: string, record: OrderTableItem) => (
                <Typography.Text>AED {parseFloat(amount).toFixed(2)}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusStyle =
                    status.toLowerCase() === 'pending' ? { color: '#C89C00' } : { color: 'green' };

                return (
                    <Typography.Text style={statusStyle} className="capitalize">
                        {status.toLowerCase()}
                    </Typography.Text>
                );
            },
        },
        {
            title: 'View',
            key: 'view',
            render: (providerId: string, record: OrderTableItem) => (
                <Link
                    to={`/${logistics.index}/${logistics.orderHistory}/${logistics.track}?trackingNo=${record.providerId}`}
                    style={{ color: '#FF3A3A' }}
                >
                    Track your order
                </Link>
            ),
        },
    ];

    return (
        <>
            {screens.xs ? (
                <OrdersMobile isLoading={isLoading} data={orders} />
            ) : (
                <Table
                    scroll={{ x: 756 }}
                    loading={isLoading}
                    dataSource={orders.map(item => ({ ...item, key: item.transactionId }))}
                    columns={columns}
                    pagination={false}
                />
            )}

            <Pagination
                className="mt-3 text-center sm:mt-10 sm:text-end"
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
