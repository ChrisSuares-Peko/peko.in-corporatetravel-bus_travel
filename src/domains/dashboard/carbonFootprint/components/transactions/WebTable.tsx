import React from 'react';

import type { TableColumnsType, TableProps } from 'antd';
import { Table, Pagination } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { tableData } from '../../types/dashboard';

type Props = {
    data: tableData[];
    isloading: boolean;
    page: number;
    handlePageChange: (page: number, pageSize: number) => void;
    count: number | undefined;
    handleSort: (sort: string) => void;
    handleFilter: (sort: FilterValue | null) => void;
};

const WebTable = ({
    data,
    isloading,
    page,
    count,
    handlePageChange,
    handleSort,
    handleFilter,
}: Props) => {
    const handleTableChange: TableProps<tableData>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        if (sorter) {
            Object.values(sorter).forEach(sortItem => {
                if (sortItem && sortItem === 'ascend') {
                    handleSort('ASC');
                } else if (sortItem && sortItem === 'descend') {
                    handleSort('DESC');
                }
            });
        }
        if (filters.status) handleFilter(filters.status);
    };

    const columns: TableColumnsType<tableData> = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date: string) => <span>{formattedDateTime(new Date(date))}</span>,
        },
        {
            title: 'Order ID',
            dataIndex: 'transactionId',
        },
        {
            title: 'Project',
            dataIndex: 'projectName',
            render: (name: string) => `${name || 'NA'}`,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (amount: string) => `AED ${formatNumberWithLocalString(Number(amount))}`,
        },
        {
            title: 'Credits',
            dataIndex: 'creditPurchased',
            render: (amount: string) =>
                `${formatNumberWithLocalString(Number(amount))} ${Number(amount) < 2 ? 'ton' : 'tons'} CO₂`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text: string) => (
                <span className={`${text === 'SUCCESS' ? 'text-textGreen' : 'text-bgOrange2'}`}>
                    {text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : 'N/A'}
                </span>
            ),
        },
    ];
    return (
        <>
            <Table
                rowKey={record => record.transactionId}
                columns={columns}
                dataSource={data}
                loading={isloading}
                pagination={false}
                onChange={handleTableChange}
            />
            <Pagination
                current={page}
                onChange={handlePageChange}
                size="default"
                className="text-end pt-7"
                total={count}
                showSizeChanger={false}
            />
        </>
    );
};
export default WebTable;
