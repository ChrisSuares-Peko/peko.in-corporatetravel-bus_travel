import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import CategoryHeader from './CategoryHeader';
import CategoryModal from './CategoryModal';
import useGetCategory from '../../hooks/useGetCategory';
import { CategoryData } from '../../types/category';

const Categories = () => {
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
    const [modalData, setModalData] = useState<CategoryData>();
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    } = useGetCategory(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleActive = (categoryId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ categoryId, categoryStatus: active });
    };
    const handleEdit = (record: CategoryData) => {
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
            title: 'Category Name',
            sorter: true,
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Vendor Name',
            sorter: true,
            dataIndex: ['vendor', 'vendorName'],
            key: 'vendor',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.vendor.vendorName}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            sorter: true,
            dataIndex: 'categoryStatus',
            key: 'categoryStatus',
            render: (status: any, record: CategoryData) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.id, record.categoryStatus)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.id, record.categoryStatus)}
                    />
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: CategoryData) => (
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
            <CategoryHeader
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
                <CategoryModal
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

export default Categories;
