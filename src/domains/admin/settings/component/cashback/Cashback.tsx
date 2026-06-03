import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString, formatNumberWithoutCommas } from '@utils/priceFormat';

import CashbackHeader from './CashbackHeader';
import CashbackModal from './CashbackModal';
import useGetCashbacks from '../../hooks/useGetCashbacks';
import { ServiceData } from '../../types/cashback';

const Cashback = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: '',
        partnerId: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<ServiceData>();
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const {
        isLoading,
        tableData,
        count,
        deleteDoc,
        setRefresh,
        updateActiveStatus,
        packageData,
        serviceData,
        downloadReport,
    } = useGetCashbacks(filters);
    const { handleSearch, handlePageChange, handleTableChange, handlePartnerChange } = useFilter({
        setFilters,
    });
    const handleActive = (cashbackId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ cashbackId, serviceStatus: active });
    };
    const handleEdit = (record: ServiceData) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = (id: number) => {
        deleteDoc(id);
        setModalData(undefined);
        setOpenConfirmationModal(false);
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            sorter: true,
            key: 'createdAt',
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Service Operator',
            sorter: true,
            dataIndex: 'serviceProvider',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.serviceOperator.serviceProvider || '-'}</Typography.Text>
            ),
            key: 'serviceOperator',
        },
        {
            title: 'Commision Type',
            sorter: true,
            dataIndex: 'cashbackType',
            key: 'cashbackType',
        },
        {
            title: 'Package Name',
            sorter: true,
            dataIndex: 'packageName',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.package.packageName || '-'}</Typography.Text>
            ),
            key: 'package',
        },
        {
            title: 'Partner Name',
            sorter: true,
            dataIndex: 'partnerName',
            key: 'partnerName',
            render: (partnerName: string) => partnerName || 'N/A',
        },
        {
            title: 'Surcharge',
            sorter: true,
            dataIndex: 'surcharge',
            key: 'surcharge',
            render: (surcharge: string) => `AED ${formatNumberWithLocalString(surcharge)}`,
        },
        {
            title: 'Cashback',
            sorter: true,
            dataIndex: 'cashback',
            key: 'cashback',
            render: (text: any, record: any) => (
                <Typography.Text>
                    {record.cashbackType === 'PERCENTAGE'
                        ? `${formatNumberWithoutCommas(text)} %`
                        : `AED ${formatNumberWithLocalString(text) ?? '0.00'}`}{' '}
                </Typography.Text>
            ),
        },
        {
            title: 'Base limit',
            sorter: true,
            dataIndex: 'baseLimit',
            key: 'baseLimit',
            render: (baseLimit: string) =>
                `AED ${formatNumberWithLocalString(baseLimit) ?? '0.00'}`,
        },
        {
            title: 'Unit price',
            sorter: true,
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (unitPrice: string) =>
                `AED ${formatNumberWithLocalString(unitPrice) ?? '0.00'}`,
        },
        {
            title: 'Status',
            sorter: true,
            dataIndex: 'serviceStatus',
            key: 'serviceStatus',
            render: (status: any, record: ServiceData) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.id, record.serviceStatus)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.id, record.serviceStatus)}
                    />
                ),
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: ServiceData) => (
                <Flex justify="start">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined
                        className=" text-brandColor ml-7"
                        onClick={() => {
                            setOpenConfirmationModal(true);
                            setModalData(record);
                        }}
                    />
                </Flex>
            ),
        },
    ];
    return (
        <Flex vertical gap={20}>
            <CashbackHeader
                downloadReport={downloadReport}
                serviceData={serviceData}
                packageData={packageData}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
                handlePartnerChange={handlePartnerChange}
                partnerId={filters.partnerId}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
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
                <CashbackModal
                    serviceData={serviceData}
                    packageData={packageData}
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    handlePartnerChange={handlePartnerChange}
                    partnerId={filters.partnerId}
                />
            )}

            {openConfirmationModal && (
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this cashback? This action will make the service unusable. Please be careful."
                    handleSubmit={() => handleDelete(modalData!.id)}
                    isLoading={isLoading!}
                />
            )}
        </Flex>
    );
};

export default Cashback;
