import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import WorkPlanHeader from './WorkPlanHeader';
import WorkPlanModal from './WorkPlanModal';
import useGetWorkPlan from '../../hooks/work_plans/useGetWorkPlan';
import { WorkPlanData } from '../../types/workPlan';

const WorkPlan = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<WorkPlanData>();
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    } = useGetWorkPlan(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleActive = (planId: number | string | any, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ planId, status: active });
    };
    const handleEdit = (record: WorkPlanData) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteDoc(modalData!?.id);
        setDeleteModal(false);
    };
    const columns = [
        {
            title: 'Date',
            sorter: true,
            dataIndex: 'createdAt',
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
        },
        {
            title: 'Work Name',
            sorter: true,
            dataIndex: ['work', 'name'],
            key: 'work',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.work.name || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Price',
            sorter: true,
            dataIndex: 'price',
            key: 'price',
            render: (price: any) => (
                <Typography.Text>AED {formatNumberWithLocalString(price)}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            sorter: true,
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: WorkPlanData) =>
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
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: WorkPlanData) => (
                <Flex justify="start">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined
                        className=" text-brandColor ml-7"
                        onClick={() => {
                            setModalData(record);
                            setDeleteModal(true);
                        }}
                    />
                </Flex>
            ),
        },
    ];
    return (
        <Flex vertical gap={20}>
            <WorkPlanHeader
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
                <WorkPlanModal
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

export default WorkPlan;
