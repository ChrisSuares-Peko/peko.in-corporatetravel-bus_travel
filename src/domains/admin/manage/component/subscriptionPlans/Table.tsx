import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import BulkUploadModal from '@components/molecular/modals/BulkUploadModal';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import OperatorHeader from './Header';
import CreateUpdateModal from './Modal';
import useSoftwarePlansBulkUpload from '../../hooks/subscriptionPlans/useSoftwarePlansBulkUpload';
import useSubscriptionData from '../../hooks/subscriptionPlans/useSubscriptionPlans';
import useFilter from '../../hooks/useFilters';
import { SubscriptionPlan } from '../../types/subscriptionPlans';
import getSubscriptionPlansColumns from '../columns/SubscriptionPlansColumns';

const SubscriptionPlansPage = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [openBulkModal, setOpenBulkModal] = useState(false);
    const [modalData, setModalData] = useState<SubscriptionPlan>();
    const {
        isLoading,
        tableData,
        count,
        handleRefresh,
        updateActiveStatus,
        deleteSubscriptionPlans,
        downloadReport,
    } = useSubscriptionData(filters);
    const {
        getSoftwarePlansBulkUploadTemplate,
        isTemplateFileLoading,
        BulkUpload,
        isExcelUploading,
    } = useSoftwarePlansBulkUpload();

    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });

    const handleActive = (subscriptionId: number | string, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ subscriptionId, status: active });
    };
    const handleEdit = (record: SubscriptionPlan) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteSubscriptionPlans(modalData!?.id);
        setDeleteModal(false);
    };
    const handleCreateModal = () => {
        setOpenModal(true);
        setModalData(undefined);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(undefined);
    };
    const handleConfirmation = (record: SubscriptionPlan) => {
        setModalData(record);
        setDeleteModal(true);
    };
    const columns = getSubscriptionPlansColumns({
        handleActive,
        handleEdit,
        handleConfirmation,
    });
    return (
        <Flex vertical gap={20}>
            <OperatorHeader
                downloadReport={downloadReport}
                handleSearch={handleSearch}
                searchText={filters.searchText}
                setOpenModal={handleCreateModal}
                setOpenBulkModal={setOpenBulkModal}
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
                <CreateUpdateModal
                    data={modalData}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    handleRefresh={handleRefresh}
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
            {openBulkModal && (
                <BulkUploadModal
                    open={openBulkModal}
                    handleCancel={() => setOpenBulkModal(false)}
                    handleBulkUpload={file => BulkUpload(file)}
                    handleTemplateDownload={getSoftwarePlansBulkUploadTemplate}
                    isTemplateFileLoading={isTemplateFileLoading}
                    isUploading={isExcelUploading}
                />
            )}
        </Flex>
    );
};

export default SubscriptionPlansPage;
