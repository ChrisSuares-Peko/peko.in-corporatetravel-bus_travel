import React, { Suspense, lazy, useState } from 'react';

import {
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    LinkOutlined,
    MailOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import { Flex, Typography, Pagination, Button } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import Header from './Header';
import useFilter from '../hooks/useFilters';
import { useGetSystemUserData } from '../hooks/useGetSystemUserData';
import { User } from '../types/systemUserTypes';

const EditSystemUserModal = lazy(() => import('./EditSystemUserModal'));
const SystemUser = () => {
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
    const [modalData, setModalData] = useState<User>();
    const {
        isLoading,
        tableData,
        count,
        deleteUserById,
        updateActiveStatus,
        resentEmailById,
        setRefresh,
        downloadReport,
    } = useGetSystemUserData(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleEdit = (record: User) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteUserById(modalData!?.id);
        setDeleteModal(false);
    };
    const handleResentMail = (record: User) => {
        resentEmailById(record.credentialId);
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
            title: 'Username',
            sorter: true,
            dataIndex: ['credential', 'username'],
            key: 'credential',
            render: (_: any, record: any) => (
                <Typography.Text>{record?.credential.username || 'N/A'}</Typography.Text>
            ),
        },
        {
            title: 'Role',
            sorter: true,
            dataIndex: ['roleAndPermission', 'roleName'],
            key: 'roleAndPermission',
            render: (_: any, record: any) => (
                <Typography.Text>{record?.roleAndPermission?.roleName || 'N/A'}</Typography.Text>
            ),
        },
        {
            title: 'Contact Details',
            dataIndex: 'email',
            render: (email: any, record: User) => (
                <Flex vertical>
                    <Flex gap={8}>
                        <MailOutlined />
                        <Typography.Text>{email}</Typography.Text>
                    </Flex>
                    <Flex gap={8}>
                        <PhoneOutlined />
                        <Typography.Text>{record.mobileNo || 'N/A'}</Typography.Text>
                    </Flex>
                    <Flex gap={8}>
                        <LinkOutlined />
                        {record.portalUrl ? (
                            <Typography.Link
                                target="_blank" // Open link in new tab
                                rel="noopener noreferrer"
                                href={`//${record.portalUrl}`}
                            >
                                {record.portalUrl}
                            </Typography.Link>
                        ) : (
                            <Typography.Text>N/A</Typography.Text>
                        )}
                    </Flex>
                </Flex>
            ),
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            sorter: true,
            key: 'isActive',
            render: (status: any, record: User) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.credentialId, record.isActive)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.credentialId, record.isActive)}
                    />
                ),
        },
        {
            title: 'Resend Email',
            dataIndex: 'resent',
            key: 'resent',
            render: (_: any, record: User) => (
                <Button danger size="small" onClick={() => handleResentMail(record)}>
                    Resend Email
                </Button>
            ),
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: User) => (
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
    ];

    return (
        <Flex vertical gap={20}>
            <Header
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
                loading={isLoading}
                // scroll={{ x: 756 }}
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
            <Suspense>
                {openModal && (
                    <EditSystemUserModal
                        data={modalData}
                        handleCancel={() => setOpenModal(false)}
                        open={openModal}
                        setRefresh={setRefresh}
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

export default SystemUser;
