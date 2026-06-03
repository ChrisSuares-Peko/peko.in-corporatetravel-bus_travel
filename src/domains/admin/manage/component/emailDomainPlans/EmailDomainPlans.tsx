import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Image, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import EmailDomainPlansHeader from './EmailDomainPlansHeader';
import EmailDomainPlansModal from './EmailDomainPlansModal';
import useGetAllEmailDomainPlans from '../../hooks/emailDomainPlans/useGetAllEmailDomainPlans';
import useFilter from '../../hooks/useFilters';

const EmailDomainPlans = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>();
    const [deleteModal, setDeleteModal] = useState(false);
    const {
        tableData,
        count,
        loading,
        setRefresh,
        updateStatusEmailDomainPlans,
        downloadReport,
        deleteEmailDomainPlan,
    } = useGetAllEmailDomainPlans(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleEdit = (record: any) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleActive = (id: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateStatusEmailDomainPlans({ id, status: active });
    };
    const handleConfirmation = (record: any) => {
        setModalData(record);
        setDeleteModal(true);
    };
    const handleDelete = () => {
        deleteEmailDomainPlan(modalData!?.id);
        setDeleteModal(false);
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
            title: 'Plan Name',
            sorter: true,
            dataIndex: 'name',
            key: 'name',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Product',
            sorter: true,
            dataIndex: ['softwares_subscription', 'name'],
            key: 'name',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Monthly Price',
            sorter: true,
            dataIndex: 'monthlyPrice',
            key: 'monthlyPrice',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Yearly Price',
            sorter: true,
            dataIndex: 'yearlyPrice',
            key: 'yearlyPrice',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Description',
            dataIndex: 'descriptions',
            sorter: true,
            key: 'descriptions',
            width: 500,
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image: string) =>
                image ? <Image src={image} height={30} width={30} /> : 'N/A',
        },
        {
            title: 'Status',
            sorter: true,
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: any) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.id, record.status)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.id, record.status)}
                    />
                ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
                <Flex justify="space-between" gap={10}>
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined onClick={() => handleConfirmation(record)} />
                </Flex>
            ),
        },
    ];
    return (
        <Flex vertical gap={20}>
            <EmailDomainPlansHeader
                downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={loading}
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
                <EmailDomainPlansModal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}
            {deleteModal && (
                <ConfirmationModal
                    handleSubmit={handleDelete}
                    handleCancel={() => setDeleteModal(false)}
                    isOpen={deleteModal}
                    title="Do you want to proceed with the deletion?"
                    isLoading={false}
                />
            )}
        </Flex>
    );
};

export default EmailDomainPlans;
