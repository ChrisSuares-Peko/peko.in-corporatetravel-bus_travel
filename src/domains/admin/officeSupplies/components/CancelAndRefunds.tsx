import React, { useState } from 'react';

import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import {
    generateOrderBtn,
    generatePaymentStatusBtn,
} from '@src/domains/systemUser/ecom_manager/home/utils/dashData';
import GetProducts from '@src/domains/systemUser/ecom_manager/home/utils/GetProducts';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CancelRefundModal from './CancelRefundModal';
import Header from './Header';
import ViewAddressModal from './ViewAddressModal';
import useCancelAndRefunds from '../hooks/useCancelAndRefunds';
import useFilter from '../hooks/useFilter';

const CancelAndRefunds = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const initialValues = {
        searchText: '',
        category: '',
        sort: 'DESC',
        page: 1,
        itemsPerPage: 10,
        from: todayFormatted,
        to: todayFormatted,
        id: '',
        sortField: '',
    };

    const toTitleCase = (text: string) =>
        text?.replace(
            /\w\S*/g,
            (word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
        );

    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [viewAddress, setViewAddress] = useState(false);
    const [modalData, setModalData] = useState();
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
    const { isLoading, tableData, count, getAllTableData, downloadReport } =
        useCancelAndRefunds(filters);
    const handleCloseModal = () => {
        setOpenModal(false);
        setViewAddress(false);
        setModalData(undefined);
    };
    const handleRefresh = () => {
        getAllTableData();
    };
    const handleEdit = (record: any) => {
        setModalData(record);
        setOpenModal(true);
    };
    const columns = [
        {
            title: 'Transaction Date',
            sorter: true,
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Product name',
            dataIndex: 'orderResponse',
            key: 'orderResponse',
            render: (record: any) => <GetProducts orderResponse={record} />,
        },
        {
            title: 'Corporate Name',
            sorter: true,
            dataIndex: ['credential', 'name'],
            key: 'credential.name',
            render: (_: any, data: any) => data.credential.name,
        },
        {
            title: 'Corporate ID',
            sorter: true,
            dataIndex: ['credential', 'username'],
            key: 'credential.name',
            render: (_: any, data: any) => data.credential.username,
        },
        {
            title: 'Price',
            dataIndex: 'amountInAed',
            sorter: true,
            key: 'amountInAed',
            render: (data: any) => (
                <Typography.Text>AED {formatNumberWithLocalString(Number(data))}</Typography.Text>
            ),
        },
        {
            title: 'Current Status',
            sorter: true,
            dataIndex: 'workspaceOrderStatus',
            key: 'workspaceOrderStatus',
            render: (status: string, record: any) => {
                if (record.status === 'REFUNDED') {
                    return generateOrderBtn('Cancel Approved');
                }
                return generateOrderBtn(toTitleCase(status));
            },
        },
        {
            title: 'Payment Status',
            sorter: true,
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => generatePaymentStatusBtn(status),
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => <EditOutlined onClick={() => handleEdit(record)} />,
        },
        {
            title: 'View',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
                <EyeOutlined
                    onClick={() => {
                        setModalData(record);
                        setViewAddress(true);
                    }}
                />
            ),
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
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                // scroll={{ x: 828 }}
                onChange={handleTableChange}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
            {openModal && (
                <CancelRefundModal
                    data={modalData}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    handleRefresh={handleRefresh}
                />
            )}
            {viewAddress && (
                <ViewAddressModal
                    handleCancel={handleCloseModal}
                    open={viewAddress}
                    data={modalData}
                />
            )}
        </Flex>
    );
};

export default CancelAndRefunds;
