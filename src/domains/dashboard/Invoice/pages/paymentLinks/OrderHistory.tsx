import { useEffect, useMemo, useState } from 'react';

import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Table, Typography, Flex, Pagination, Button, Tooltip } from 'antd';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import { formattedDateTime } from '@utils/dateFormat';

import useFilter from '../../hooks/useFilter';
import { useAllpaymentLinks } from '../../hooks/useGetAllPaymentLinksApi';

const OrderHistoryTable = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
    };
    const [filters, setFilters] = useState(initialValues);
    const { handleSearch, handlePageChange, searchText } = useFilter({
        setFilters,
    });
    const { tableData, count, isLoading } = useAllpaymentLinks(filters);
    const [tooltipText, setTooltipText] = useState('Copy to clipboard');

    const debouncedSetFilters = useMemo(
        () =>
            debounce((newSearchText: string) => {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    searchText: newSearchText,
                    page: 1,
                }));
            }, 500),
        []
    );

    useEffect(() => {
        debouncedSetFilters(searchText);
        return () => {
            debouncedSetFilters.cancel();
        };
    }, [searchText, debouncedSetFilters]);

    const toTitleCase = (text: string) =>
        text?.replace(
            /\w\S*/g,
            (word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
        );

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span>{formattedDateTime(new Date(date))}</span>,
        },
        {
            title: 'Customer Name',
            dataIndex: 'sentPayload',
            key: 'sentPayload',
            render: (sentPayload: any) => {
                const obj = sentPayload || null;
                return obj ? obj.full_name : 'N/A';
            },
        },
        {
            title: 'Payment ID',
            dataIndex: 'invoiceId',
            key: 'invoiceId',
            render: (id: any) => id || 'N/A',
        },
        {
            title: 'Amount',
            dataIndex: 'sentPayload',
            key: 'sentPayload',
            render: (sentPayload: any) => {
                if (!sentPayload) {
                    return 'N/A';
                }
                try {
                    const amountDue = sentPayload && sentPayload.amount ? sentPayload.amount : null; // Access amountDue directly from obj
                    if (amountDue !== null) {
                        // Format amountDue to two decimal points
                        return `AED ${parseFloat(amountDue).toFixed(2)}`;
                    }
                    return 'N/A';
                } catch (error) {
                    return 'N/A';
                }
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'paymentMode',
            render: (text: string) => toTitleCase(text),
        },
        {
            title: 'Payment Link',
            dataIndex: 'client_url',
            key: 'client_url',

            render: (record: any) => (
                <Flex gap="middle">
                    <Link to={record}>
                        <Button danger>Payment Link</Button>
                    </Link>
                    <Tooltip
                        title={tooltipText}
                        onVisibleChange={visible => {
                            if (!visible) {
                                setTooltipText('Copy to clipboard');
                            }
                        }}
                    >
                        <CopyOutlined
                            className="text-iconRed custom-copyable"
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(record)
                                    .then(() => {
                                        setTooltipText('Copied!');
                                    })
                                    .catch(err => {
                                        setTooltipText('Failed to copy');
                                    });
                            }}
                        />
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return (
        <>
            <Flex className="w-full mt-6" wrap="wrap" justify="space-between" align="center">
                <Typography.Text className="text-valueText text-xl">Order History</Typography.Text>
                <Flex className="w-full md:w-auto">
                    <Input
                        value={searchText}
                        placeholder="Search "
                        suffix={<SearchOutlined />}
                        onChange={handleSearch}
                        allowClear
                        type="text"
                        variant="outlined"
                        className="w-full sm:w-fit"
                        maxLength={90}
                    />
                </Flex>
            </Flex>
            <Table
                className="w-full mt-6"
                scroll={{ x: 992 }}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7 xs:mb-12 md:mb-0"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
        </>
    );
};

export default OrderHistoryTable;
