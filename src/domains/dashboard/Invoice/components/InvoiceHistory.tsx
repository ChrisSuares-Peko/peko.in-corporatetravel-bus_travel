import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import {
    Col,
    Flex,
    Input,
    Pagination,
    PaginationProps,
    Row,
    Select,
    Skeleton,
    Space,
    Table,
    Typography,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import useGetInvoice from '../hooks/useGetInvoice';
import DownloadInvoiceData from '../hooks/useInvoiceDownloadApi';
import useTracker from '../hooks/useTracker';
import { setInvoiceId } from '../slices/InvoicesSlices';

const InvoiceHistory = () => {
    const {
        data,
        isLoading,
        searchText,
        setSearchText,
        count,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
    } = useGetInvoice();

    const navigate = useNavigate();

    const { updateStatus } = useTracker();
    const [statusValues, setStatusValues] = useState<any>({});

    const dispatch = useDispatch();

    const handleChange = (value: string, id: number) => {
        setStatusValues({ ...statusValues, [id]: value });
        updateStatus(value, id);
    };

    const toTitleCase = (text: string) =>
        text?.replace(
            /\w\S*/g,
            (word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
        );

    const statusColors = {
        Pending: '#C89C00',
        Expired: 'red',
        Paid: 'green',
    };

    const columns = (handleDownload: (id: string) => void) => [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span>{formattedDateTime(new Date(date))}</span>,
        },
        {
            title: 'Customer Name',
            dataIndex: 'recipientDetails',
            key: 'recipientDetails',
            render: (recipientDetails: string) => {
                const obj = recipientDetails ? JSON.parse(recipientDetails) : null;
                return obj ? obj.customerName : 'N/A';
            },
        },
        {
            title: 'Invoice ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: any) => id || 'N/A',
        },
        {
            title: 'Amount',
            dataIndex: 'paymentDetails',
            key: 'productDetails',
            render: (paymentDetails: string) => {
                if (!paymentDetails) {
                    return 'N/A';
                }
                try {
                    const obj = JSON.parse(paymentDetails);
                    const amountDue = obj && obj.amountDue ? obj.amountDue : null; // Access amountDue directly from obj
                    return amountDue !== null ? `AED ${amountDue}` : 'N/A';
                } catch (error) {
                    return 'N/A';
                }
            },
        },

        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
            render: (text: string) => toTitleCase(text),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => {
                const currentStatus = statusValues[record.id] || status;
                let statusStyle = {
                    color: '#C89C00',
                    fontWeight: '500',
                };
                if (currentStatus.toLowerCase() === 'pending') {
                    statusStyle = {
                        color: '#C89C00',
                        fontWeight: '500',
                    };
                }
                if (currentStatus.toLowerCase() === 'paid') {
                    statusStyle = {
                        color: 'green',
                        fontWeight: '500',
                    };
                }
                if (currentStatus.toLowerCase() === 'expired') {
                    statusStyle = {
                        color: 'red',
                        fontWeight: '500',
                    };
                }
                return (
                    <Flex style={statusStyle}>
                        <Select
                            className="w-32"
                            value={currentStatus}
                            style={{ width: 120 }}
                            onChange={value => handleChange(value, record.id)}
                            options={[
                                {
                                    value: 'PENDING',
                                    label: (
                                        <span style={{ color: statusColors.Pending }}>Pending</span>
                                    ),
                                },
                                {
                                    value: 'EXPIRED',
                                    label: (
                                        <span style={{ color: statusColors.Expired }}>Expired</span>
                                    ),
                                },
                                {
                                    value: 'PAID',
                                    label: <span style={{ color: statusColors.Paid }}>Paid</span>,
                                },
                            ]}
                        />
                    </Flex>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'action',
            render: (id: any) => (
                <Space size="middle">
                    <Typography.Text
                        className="cursor-pointer"
                        onClick={() => {
                            dispatch(setInvoiceId(id));
                            navigate(paths.invoice.trackDetails);
                        }}
                        style={{ color: 'red' }}
                    >
                        View
                    </Typography.Text>
                </Space>
            ),
        },
    ];

    const { getInvoiceDetails, loader } = DownloadInvoiceData();

    const handleDownload = async (id: string) => {
        await getInvoiceDetails(id);
    };

    const handlePageChange: PaginationProps['onChange'] = (page, length) => {
        setCurrentPage(page);
        setLimit(length);
    };

    return (
        <Flex vertical gap={18} className="w-full">
            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                <Col xs={24} sm={12} md={6}>
                    <Typography.Text className="xl:text-xl lg:text-lg  sm:text-lg text-lg font-medium ">
                        Track Invoice
                    </Typography.Text>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Search for orders"
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={100}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Col>
            </Row>
            {isLoading ? (
                <Skeleton className="mt-5" paragraph={{ rows: 15 }} active />
            ) : (
                <Table
                    className="mt-5"
                    columns={columns(handleDownload)}
                    dataSource={data?.invoiceData}
                    loading={loader}
                    pagination={false}
                    rowKey="id"
                />
            )}
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                size="default"
                className="text-end pt-7 xs:mb-12 md:mb-0"
                defaultPageSize={limit}
                total={count}
            />
        </Flex>
    );
};

export default InvoiceHistory;
