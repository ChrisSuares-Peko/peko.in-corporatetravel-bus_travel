import React, { Suspense, lazy, useState } from 'react';

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import RolesHeader from './RolesHeader';
import useFilter from '../hooks/useFilters';
import { useGetRoles } from '../hooks/useGetRoles';
import { Role } from '../types/systemUserTypes';

const RoleModal = lazy(() => import('./RoleModal'));

const Roles = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: 'createdAt',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<Role>();
    const {
        isLoading,
        tableData,
        count,
        deleteRoleById,
        setRefresh,
        updateActiveStatus,
        downloadReport,
    } = useGetRoles(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleEdit = (record: Role) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteRoleById(modalData!?.id);
        setDeleteModal(false);
    };

    const handleActive = (corporateId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ corporateId, isActive: active });
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
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
            sorter: true,
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Role) => (
                <Flex justify="start">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    {/* <DeleteOutlined
                        className=" text-brandColor ml-7"
                        onClick={() => {
                            setModalData(record);
                            setDeleteModal(true);
                        }}
                    /> */}
                </Flex>
            ),
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
    ];

    return (
        <Flex vertical gap={20}>
            <RolesHeader
                handleDownloadReport={downloadReport}
                searchText={filters.searchText}
                handleSearch={handleSearch}
                setRefresh={setRefresh}
            />

            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                onChange={handleTableChange}
                loading={isLoading}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
            <Suspense>
                {openModal && (
                    <RoleModal
                        open={openModal}
                        handleCancel={() => setOpenModal(false)}
                        setRefresh={setRefresh}
                        data={modalData}
                    />
                )}
            </Suspense>
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

export default Roles;
