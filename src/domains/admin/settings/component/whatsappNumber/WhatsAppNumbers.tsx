import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';

import WhatsAppNumberModal from './WhatsAppNumberModal';
import WhatsAppNumbersHeaders from './WhatsAppNumbersHeaders';
import useDeleteNumber from '../../hooks/whatsappNotification/useDeleteNumber';
import useEditStatus from '../../hooks/whatsappNotification/useEditStatus'; // Import the useEditStatus hook
import useWhatsAppData from '../../hooks/whatsappNotification/useWhatsAppData';
import { getData, numbers } from '../../types/whatsappNotification';

const WhatsAppNumbers = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
    };

    const [filters, setFilters] = useState<getData>(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<numbers>();

    const { whatsappNumbers, totalCount, isLoading, fetchWhatsAppNumbers } = useWhatsAppData({
        page: filters.page,
        searchText: filters.searchText || '',
        itemsPerPage: filters.itemsPerPage,
    });

    const { handlePageChange, handleTableChange } = useFilter({ setFilters });

    const handleSearch = (e: any) => {
        const searchText = e.target.value;
        setFilters(prev => ({
            ...prev,
            searchText,
            page: 1,
        }));
        fetchWhatsAppNumbers({ ...filters, searchText, page: 1 }); // Call fetch after updating filters
    };

    const { handleEditStatus, loading: statusLoading } = useEditStatus();
    const { handleDeleteNumber, loading: isDeleting } = useDeleteNumber();

    const handleEdit = (record: numbers) => {
        setModalData(record);
        setOpenModal(true);
    };

    const handleDelete = async () => {
        if (modalData) {
            const success = await handleDeleteNumber(modalData.whatsappNumber);
            if (success) {
                fetchWhatsAppNumbers(filters);
                setDeleteModal(false);
            }
        }
    };

    const toggleStatus = async (record: numbers) => {
        const updatedStatus = !record.status;
        const success = await handleEditStatus(record.whatsappNumber, updatedStatus);
        if (success) {
            fetchWhatsAppNumbers(filters);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => `${text || '-'}`, // Add + prefix
        },
        {
            title: 'WhatsApp Number',
            dataIndex: 'whatsappNumber',
            key: 'whatsappNumber',
            render: (text: string) => `+${text}`, // Add + prefix
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: numbers) =>
                status ? (
                    <CheckOutlined
                        className={`cursor-pointer text-textLime ${statusLoading ? 'disabled' : ''}`}
                        onClick={() => !statusLoading && toggleStatus(record)}
                    />
                ) : (
                    <CloseOutlined
                        className={`cursor-pointer text-brandColor ${statusLoading ? 'disabled' : ''}`}
                        onClick={() => !statusLoading && toggleStatus(record)}
                    />
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: numbers) => (
                <Flex justify="start">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined
                        className="text-brandColor ml-7"
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
            <WhatsAppNumbersHeaders
                setRefresh={() => fetchWhatsAppNumbers(filters)}
                handleSearch={handleSearch} // Pass updated handleSearch
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.whatsappNumber}
                columns={columns}
                dataSource={whatsappNumbers}
                pagination={false}
                loading={isLoading || statusLoading}
                onChange={handleTableChange}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={totalCount}
                showSizeChanger={false}
            />
            {openModal && (
                <WhatsAppNumberModal
                    setRefresh={() => fetchWhatsAppNumbers(filters)}
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

export default WhatsAppNumbers;
