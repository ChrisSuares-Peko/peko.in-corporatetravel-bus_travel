import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Table, Typography } from 'antd';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import AccessCodeHeader from './AccessCodeHeader';
import AccessCodeModal from './AccessCodeModal';
import useGetAccessCode from '../../hooks/useGetAccessCode';
import { AccessData } from '../../types/accessCode';

const AccessCode = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<AccessData>();
    const [deleteModal, setDeleteModal] = useState(false);
    const { isLoading, tableData, count, deleteDoc, setRefresh, downloadReport } =
        useGetAccessCode(filters);
    const { handleSearch, handlePageChange } = useFilter({ setFilters });
    const handleEdit = (record: AccessData) => {
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
            title: 'Access Code',
            dataIndex: 'access_code',
            key: 'access_code',
        },
        {
            title: 'Partner ID',
            dataIndex: 'partnerId',
            key: 'partnerId',
        },
        {
            title: 'Group ID',
            dataIndex: 'groupId',
            key: 'groupId',
        },
        {
            title: 'Status',
            dataIndex: 'isAssigned',
            key: 'isAssigned',
            render: (isAssigned: any) =>
                isAssigned === 1 || isAssigned === true ? (
                    <Typography.Text className="text-textGreen">ASSIGNED</Typography.Text>
                ) : (
                    <Typography.Text> UNASSIGNED</Typography.Text>
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: AccessData) => (
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
            <AccessCodeHeader
                downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                scroll={{ x: 756 }}
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
                <AccessCodeModal
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

export default AccessCode;
