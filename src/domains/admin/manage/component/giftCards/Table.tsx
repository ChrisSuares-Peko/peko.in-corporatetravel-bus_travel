import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';

import AutoUpdateModal from './AutoUpdateModal';
import GiftCardHeader from './Header';
import CreateUpdateModal from './Modal';
import useFilter from '../../hooks/useFilters';
import useGiftCardsData from '../../hooks/useGiftCards';
import { GiftCardsBody } from '../../types/giftCards';
import getGiftCardsColumns from '../columns/GiftCardColumns';

const GiftCardsPage = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [modalData, setModalData] = useState<GiftCardsBody>();
    const {
        isLoading,
        tableData,
        count,
        handleRefresh,
        updateActiveStatus,
        vendorData,
        downloadReport,
    } = useGiftCardsData(filters);
    const {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        setSearchText,
        handleTableChange,
    } = useFilter({
        setFilters,
    });

    const handleActive = (giftCardId: number | string, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ giftCardId, status: active });
    };
    const handleEdit = (record: GiftCardsBody) => {
        setModalData(record);
        setOpenModal(true);
    };

    const handleCreateModal = () => {
        setOpenModal(true);
        setModalData(undefined);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(undefined);
    };
    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };
    const columns = getGiftCardsColumns({
        handleActive,
        handleEdit,
    });
    return (
        <Flex vertical gap={20}>
            <GiftCardHeader
                downloadReport={downloadReport}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                setSearchText={setSearchText}
                searchText={filters.searchText}
                setOpenModal={handleCreateModal}
                setOpenUpdateModal={setOpenUpdateModal}
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
                    vendorData={vendorData}
                />
            )}
            {openUpdateModal && (
                <AutoUpdateModal
                    data={modalData}
                    open={openUpdateModal}
                    handleCancel={handleCloseUpdateModal}
                    handleRefresh={handleRefresh}
                    vendorData={vendorData}
                />
            )}
        </Flex>
    );
};

export default GiftCardsPage;
