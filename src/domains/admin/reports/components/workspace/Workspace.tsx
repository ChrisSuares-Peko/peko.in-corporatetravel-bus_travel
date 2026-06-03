import React, { useState } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Flex, Pagination, Select, Typography } from 'antd';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import Header from './Header';
import OrderUpdateModal from './OrderModal';
import useFilter from '../../hooks/useFilter';
import useWorkspace from '../../hooks/useWorkspace';

export type DropDown = {
    value: number | string;
    label: string;
}[];

const statusOptions: DropDown = [
    {
        value: 'PENDING',
        label: 'PENDING',
    },
    {
        value: 'ONPROGRESS',
        label: 'ONPROGRESS',
    },
    {
        value: 'COMPLETE',
        label: 'COMPLETE',
    },
];

const Workspace = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>();

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
        id: '',
    };
    const [filters, setFilters] = useState(initialValues);
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
    const { isLoading, tableData, count, getAllTableData, downloadReport, updateStatus } =
        useWorkspace(filters);
    const handleEdit = (record: any) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(undefined);
    };
    const handleRefresh = () => {
        getAllTableData();
    };
    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            sorter: true,
            key: 'transactionDate',
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
            dataIndex: 'corporateTxnId',
        },
        {
            title: 'Corporate ID',
            sorter: true,
            dataIndex: ['credential', 'username'],
            render: (_: any, data: any) => (
                <Typography.Text>{data?.credential.username || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Corporate Name',
            dataIndex: ['credential', 'name'],
            sorter: true,
            render: (_: any, data: any) => (
                <Typography.Text>{data?.credential.name || '-'}</Typography.Text>
            ),
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
            title: 'Plan Name',
            dataIndex: 'orderResponse',
            key: 'orderResponse',
            render: (data: any) => (
                <Typography.Text>{JSON.parse(data)?.planDetails?.name}</Typography.Text>
            ),
        },
        {
            title: 'Billing Cycle',
            dataIndex: 'orderResponse',
            key: 'orderResponse',
            render: (data: any) => (
                <Typography.Text className="capitalize">
                    {JSON.parse(data)?.planDetails?.billingCycle.toLowerCase()}
                </Typography.Text>
            ),
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            sorter: true,
            key: 'paymentMode',
            render: (data: any) => (
                <Typography.Text className="capitalize">{data.toLowerCase()}</Typography.Text>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amountInAed',
            sorter: true,
            key: 'amountInAed',
            render: (data: any) => (
                <Typography.Text>AED {formatNumberWithLocalString(data)}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'workspaceOrderStatus',
            key: 'workspaceOrderStatus',
            sorter: true,
            render: (status: any, data: any) => (
                <Flex>
                    <Select
                        onChange={value => updateStatus(data.id, value)}
                        placeholder="Please select a status"
                        filterOption={false}
                        options={statusOptions}
                        defaultValue={status ? status.toUpperCase() : ''}
                    />
                </Flex>
            ),
        },
        {
            title: 'View',
            dataIndex: 'view',
            render: (_: any, record: any) => <EyeOutlined onClick={() => handleEdit(record)} />,
        },
    ];
    return (
        <Flex vertical gap={20}>
            <Header
                handleDownloadReport={downloadReport}
                from={filters.from}
                to={filters.to}
                handleDateChange={handleDateChange}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                style={{ overflow: 'auto' }}
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
                <OrderUpdateModal
                    data={modalData}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    handleRefresh={handleRefresh}
                />
            )}
        </Flex>
    );
};

export default Workspace;
