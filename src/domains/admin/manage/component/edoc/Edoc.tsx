import React, { useState } from 'react';

import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';
import { Link } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import Edocmodal from './Edocmodal';
import EdocsHeader from './EdocsHeader';
import useFilter from '../../hooks/useFilters';
import useGetEDocs from '../../hooks/useGetEDocs';
import { Document } from '../../types/edocTypes';

type Props = {};

const Edoc = (props: Props) => {
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
    const [modalData, setModalData] = useState<Document>();
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    } = useGetEDocs(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleActive = (docId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ docId, status: active });
    };
    const handleEdit = (record: Document) => {
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
            title: 'Document Name',
            sorter: true,
            dataIndex: 'documentName',
            key: 'documentName',
        },
        {
            title: 'Category',
            sorter: true,
            dataIndex: ['category', 'categoryName'],
            render: (_: any, data: any) => (
                <Typography.Text>{data?.category.categoryName || '-'}</Typography.Text>
            ),
            key: 'category',
        },
        {
            title: 'Description',
            sorter: true,
            dataIndex: 'description',
            key: 'description',
            render: (description: any) => <Typography.Text>{description}</Typography.Text>,
        },
        {
            title: 'Document',
            dataIndex: 'documentUrl',
            render: (documentUrl: any) =>
                documentUrl !== null ? (
                    <Link
                        to={documentUrl}
                        target="_blank" // Open link in new tab
                        rel="noopener noreferrer"
                    >
                        <DownloadOutlined />
                    </Link>
                ) : (
                    ''
                ),
            key: 'documentUrl',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            key: 'status',
            render: (status: any, record: Document) =>
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
            render: (_: any, record: Document) => (
                <Flex justify="space-between">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined
                        className=" text-brandColor"
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
            <EdocsHeader
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
                <Edocmodal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}{' '}
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

export default Edoc;
