import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import Header from './Header';
import CreateUpdateModal from './Modal';
import useEsimPlansData from '../../hooks/useEsimPlans';
import useFilter from '../../hooks/useFilters';
import { EsimPlan } from '../../types/eSIM';
import getEsimPlanColumns from '../columns/eSIMPlansColumns';

const ConnectPage = () => {
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
    const [modalData, setModalData] = useState<EsimPlan>();
    const {
        isLoading,
        tableData,
        count,
        handleRefresh,
        updateActiveStatus,
        deleteConnectProvider,
        downloadReport,
    } = useEsimPlansData(filters);
    const {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        setSearchText,
        handleTableChange,
    } = useFilter({ setFilters });

    const handleActive = (planId: number | undefined, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ planId, status: active });
    };
    const handleEdit = (record: EsimPlan) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteConnectProvider({ planId: modalData!?.id });
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
    const handleConfirmation = (record: EsimPlan) => {
        setModalData(record);
        setDeleteModal(true);
    };
    const columns = getEsimPlanColumns({
        handleActive,
        handleEdit,
        handleConfirmation,
    });
    return (
        <Flex vertical gap={20}>
            <Header
                downloadReport={downloadReport}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                setSearchText={setSearchText}
                searchText={filters.searchText}
                setOpenModal={handleCreateModal}
            />
            <GenericTable
                rowKey={record => record.id || ''}
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
        </Flex>
    );
};

export default ConnectPage;
