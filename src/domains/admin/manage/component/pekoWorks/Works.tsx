import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import WorksHeader from './WorksHeader';
import WorksModal from './WorksModal';
import useGetWorks from '../../hooks/useGetWorks';
import { WorkData } from '../../types/works';

const Works = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<WorkData>();
    const [deleteModal, setDeleteModal] = useState(false);
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    } = useGetWorks(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleActive = (workId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ workId, status: active });
    };
    const handleEdit = (record: WorkData) => {
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
            title: 'Work Name',
            sorter: true,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'POC Name',
            sorter: true,
            dataIndex: 'contactName',
            key: 'contactName',
            render: (contactName: any) => <Typography.Text>{contactName}</Typography.Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            key: 'status',
            render: (status: any, record: WorkData) =>
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
            render: (_: any, record: WorkData) => (
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
            <WorksHeader
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
            {openModal && (
                <WorksModal
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

export default Works;
