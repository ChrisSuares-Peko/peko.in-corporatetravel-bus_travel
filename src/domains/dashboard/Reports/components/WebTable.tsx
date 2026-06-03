import React from 'react';

import type { TableColumnsType, TableProps } from 'antd';
import { Pagination, Flex, Typography } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useDownloadInvoice } from '../hooks/useDownloadInvoice';
import { transactionType } from '../types';

type Props = {
    data: transactionType[];
    isloading: boolean;
    page: number;
    handlePageChange: (page: number, pageSize: number) => void;
    count: number | undefined;
    isCashbackTable: boolean;
    handleSort: (sort: string) => void;
    handleFilter: (sort: FilterValue | null) => void;
    handleTableChange: TableProps<transactionType>['onChange'];
    handleFilterChange: (value: any) => void;
    filter: string;
};

const WebTable = ({
    data,
    isloading,
    page,
    count,
    handlePageChange,
    isCashbackTable,
    handleSort,
    handleFilter,
    handleTableChange,
    handleFilterChange,
    filter,
}: Props) => {
    const { getInvoiceData, loader } = useDownloadInvoice();
    // const handleTableChange: TableProps<transactionType>['onChange'] = (
    //     pagination,
    //     filters,
    //     sorter,
    //     extra
    // ) => {
    //     if (sorter) {
    //         Object.values(sorter).forEach(sortItem => {
    //             if (sortItem && sortItem === 'ascend') {
    //                 handleSort('ASC');
    //             } else if (sortItem && sortItem === 'descend') {
    //                 handleSort('DESC');
    //             }
    //         });
    //     }
    //     if (filters.status) handleFilter(filters.status);
    //     else handleFilter(filters.status);
    // };

    const handleDownloadInvoice = (txnId: number) => {
        getInvoiceData(txnId);
    };
    const columns: TableColumnsType<transactionType> = [
        {
            title: 'Date',
            sorter: true,
            dataIndex: 'date',
            render: (date: string) => (
                <Typography.Text>{formattedDateTime(new Date(date))}</Typography.Text>
            ),
            width: 150,
        },
        {
            title: 'Order ID',
            sorter: true,
            dataIndex: 'transactionID',
            width: 180,
        },
        {
            title: 'User',
            dataIndex: 'subCorporateName',
            render: (subCorporateName: string) => (
                <Typography.Text>{subCorporateName || 'Not available'}</Typography.Text>
            ),
            align: 'center',
            width: 180,
        },
        {
            title: 'Category',
            sorter: true,
            dataIndex: 'category',
            width: 200,
        },
        {
            title: 'Operator',
            sorter: true,
            dataIndex: 'operator',
            render: (operator: string, record) => (
                <Flex vertical justify="center">
                    <Typography.Text>{operator}</Typography.Text>
                    {record.accountNumber && (
                        <Typography.Text className="text-sm font-normal">
                            {record.accountNumber}
                        </Typography.Text>
                    )}
                </Flex>
            ),
            width: 200,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: true,
            render: (amount: string) => `AED ${formatNumberWithLocalString(Number(amount))}`,
            width: 150,
        },
        {
            title: `${isCashbackTable ? 'Cashback Received' : 'Payment Mode'}`,
            dataIndex: `${isCashbackTable ? 'cashback' : 'paymentMode'}`,
            sorter: true,
            render: (wrd: string) => {
                if (isCashbackTable) {
                    const cashbackAmount = Number(wrd);
                    // Hide the row if cashback is 0
                    return cashbackAmount > 0
                        ? `AED ${formatNumberWithLocalString(cashbackAmount)}`
                        : null;
                }
                return wrd;
            },
            width: 180,
        },

        !isCashbackTable
            ? {
                  title: 'Status',
                  dataIndex: 'status',
                  render: (text: string) => (
                      <span
                          className={`${text === 'Success' ? 'text-textGreen' : 'text-bgOrange2'}`}
                      >
                          {text === 'Pending' ? 'In Progress' : text}
                      </span>
                  ),
                  filters: [
                      { text: 'Success', value: 'Success' },
                      { text: 'Failure', value: 'Failure' },
                      { text: 'In Progress', value: 'Pending' },
                  ],
                  onFilter: (value, record) => {
                      const isMatch = record.status === value;

                      if (isMatch && filter !== value) {
                          handleFilterChange(value);
                      }

                      return isMatch;
                  },
                  filterMultiple: false,
                  filterResetToDefaultFilteredValue: true,
                  width: 120,
              }
            : {
                  title: 'Payment Mode',
                  sorter: true,
                  dataIndex: 'paymentMode',
                  width: 150,
              },
        {
            title: 'Details',
            dataIndex: 'download',
            render: (text: string, record: transactionType) =>
                record.status === 'Success' && (
                    <span
                        tabIndex={0}
                        role="button"
                        onClick={() => handleDownloadInvoice(record.transactionID)}
                        onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                handleDownloadInvoice(record.transactionID);
                            }
                        }}
                        className="text-bgOrange2"
                        // Add aria-label for accessibility
                        aria-label={`Download invoice for transaction ID ${record.transactionID}`}
                    >
                        {text}
                    </span>
                ),
            width: 150,
        },
    ];
    return (
        <>
            <GenericTable
                rowKey={record => record.transactionID}
                className="w-full mt-8"
                bordered={false}
                columns={columns}
                dataSource={data}
                loading={isloading || loader}
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
