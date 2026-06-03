import React, { useState } from 'react';

import { Flex, Pagination, Typography } from 'antd';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import Header from './Header';
import useFilter from '../../hooks/useFilter';
import useGetEsimOrders from '../../hooks/useGetEsimOrders';

function formatRegionName(region: string) {
    try {
        if (!region || region === '') {
            return 'N/A';
        }
        return region
            .split('-') // Split the string into an array of words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' ') // Join the words back together with spaces
            .replace(' And ', ' and '); // Fix capitalization for 'and'
    } catch (error) {
        return region;
    }
}

const Esim = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const initialValues = {
        searchText: '',
        category: '',
        sort: 'DESC',
        sortField: '',
        page: 1,
        itemsPerPage: 10,
        from: todayFormatted,
        to: todayFormatted,
    };
    const [filters, setFilters] = useState(initialValues);
    const { isLoading, tableData, count, downloadReport } = useGetEsimOrders(filters);
    const {
        handleSearch,
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleTableChange,
    } = useFilter({
        setFilters,
        initalStartDate: initialValues.from,
        initalEndDate: initialValues.to,
    });
    //          id: item.order?.id,
    //         corporateTxnId: item.order?.corporateTxnId || '-',

    //         netPrice: orderResponse?.net_price,
    //         customerName: item.credential.name,
    //         customerId: item.credential.username,
    //         status: item.order.status,
    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: ['order', 'transactionDate'],
            sorter: true,
            key: 'date',
            render: (date: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(date))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(date))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Transaction ID',
            sorter: true,
            dataIndex: ['order', 'corporateTxnId'],
            render: (_: any, data: any) => (
                <Typography.Text>{data?.order.corporateTxnId || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Corporate ID',
            sorter: true,
            dataIndex: ['credential', 'username'],
            render: (data: any) => <Typography.Text>{data || ''}</Typography.Text>,
        },
        {
            title: 'Corporate Name',
            sorter: true,
            dataIndex: ['credential', 'name'],
            render: (data: any) => <Typography.Text>{data || ''}</Typography.Text>,
        },
        {
            title: 'Partner Name',
            sorter: true,
            dataIndex: ['credential', 'registeredBy'],
            render: (_: any, data: any) => (
                <Typography.Text>
                    {data?.credential?.registeredByCredential?.name ?? '-'}
                </Typography.Text>
            ),
        },
        {
            title: 'Plan',
            dataIndex: ['order', 'orderResponse'],
            key: 'plan',
            render: (_: any, data: any) => {
                const orderResponse = JSON.parse(data?.order?.orderResponse);
                let coverage = '';
                if (orderResponse?.packageType === 'local') {
                    coverage = orderResponse.countries[0].title || '';
                } else if (orderResponse?.packageType === 'regional') {
                    coverage = orderResponse?.region || '';
                } else if (orderResponse?.packageType === 'global') {
                    coverage = 'Global';
                }
                return (
                    <Flex vertical>
                        <Typography.Text>
                            {JSON.parse(data?.order.orderResponse)?.package}
                        </Typography.Text>
                        <Typography.Text>
                            Coverage: {formatRegionName(coverage) || 'N/A'}
                        </Typography.Text>
                    </Flex>
                );
            },
        },
        {
            title: 'Payment Type',
            sorter: true,
            dataIndex: ['order', 'paymentMode'],
            key: 'paymentType',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.order.paymentMode}</Typography.Text>
            ),
        },
        {
            title: 'Purchase Type',
            sorter: true,
            dataIndex: ['order', 'providerId'],
            key: 'purchaseType',
            render: (purchaseType: any, record: any) => {
                const orderResponse = JSON.parse(record?.order?.orderResponse);
                return (
                    <>
                        <Typography.Text>
                            {purchaseType === 'TOPUP' ? 'Top Up' : 'eSIM'}
                        </Typography.Text>
                        <Typography.Text>
                            {orderResponse?.esim_type ? ` - ${orderResponse?.esim_type}` : ''}
                        </Typography.Text>
                    </>
                );
            },
        },
        // {
        //     title: 'Price',
        //     dataIndex: ['order', 'orderResponse'],
        //     key: 'retailPrice',
        //     render: (_: any, data: any) => {
        //         const orderResponse = JSON.parse(data?.order?.orderResponse);
        //         console.log(orderResponse)
        //         return (
        //             <Flex vertical>
        //                 <Typography.Text>
        //                     Retail Price: USD{' '}
        //                     {formatNumberWithLocalString(orderResponse?.price || 0)}
        //                 </Typography.Text>
        //                 <Typography.Text>
        //                     Net Price: USD{' '}
        //                     {formatNumberWithLocalString(orderResponse?.net_price || 0)}
        //                 </Typography.Text>
        //             </Flex>
        //         );
        //     },
        // },
        // {
        //     title: 'Net Price',
        //     dataIndex: ['order', 'orderResponse'],
        //     key: 'netPrice',
        //     render: (_: any, data: any) => {
        //         const orderResponse = JSON.parse(data?.order.orderResponse);
        //         return (
        //             <Typography.Text>
        //                 USD {formatNumberWithLocalString(orderResponse?.net_price || 0)}
        //             </Typography.Text>
        //         );
        //     },
        // },
        {
            title: 'Amount Paid',
            sorter: true,
            dataIndex: ['order', 'amountInAed'],
            key: 'amount',
            render: (_: any, data: any) => (
                <Typography.Text>
                    AED {formatNumberWithLocalString(data?.order.amountInAed)}
                </Typography.Text>
            ),
        },
        // {
        //     title: 'Quantity',
        //     dataIndex: ['order', 'orderResponse'],
        //     key: 'quantity',
        //     render: (_: any, data: any) => {
        //         const orderResponse = JSON.parse(data?.order.orderResponse);
        //         return <Typography.Text>{orderResponse?.quantity || 0}</Typography.Text>;
        //     },
        // },
        {
            title: 'Status',
            sorter: true,
            dataIndex: ['order', 'status'],
            key: 'status',
            render: (_: any, data: any) => <Typography.Text>{data?.order.status}</Typography.Text>,
        },
    ];
    return (
        <Flex vertical gap={20}>
            <Header
                handleDownloadReport={downloadReport}
                handleSearch={handleSearch}
                searchText={filters.searchText}
                handleDateChange={handleDateChange}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                from={filters.from}
                to={filters.to}
            />
            <GenericTable
                rowKey={record => record.order?.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                onChange={handleTableChange}
                // scroll={{ x: 756 }}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
        </Flex>
    );
};

export default Esim;
