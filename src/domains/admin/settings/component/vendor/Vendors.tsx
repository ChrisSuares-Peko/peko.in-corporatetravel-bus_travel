import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';

import VendorHeader from './VendorHeader';
import VendorModal from './VendorModal';
import useFilter from '../../../manage/hooks/useFilters';
import useVendorData from '../../hooks/useVendor';
import { Vendor } from '../../types/vendors';
import getVendorColumns from '../../utils/table_column/VendorColumns';

const VendorPage = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Vendor>();
    const { isLoading, tableData, count, updateActiveStatus, handleRefresh, downloadReport } =
        useVendorData(filters);
    const {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        setSearchText,
        handleTableChange,
    } = useFilter({
        setFilters,
    });

    const handleActive = (vendorId: number | string, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ vendorId, isActive: active });
    };
    const handleEdit = (record: Vendor) => {
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
    const columns = getVendorColumns({
        handleActive,
        handleEdit,
    });
    return (
        <Flex vertical gap={20}>
            <VendorHeader
                downloadReport={downloadReport}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                setSearchText={setSearchText}
                searchText={filters.searchText}
                setOpenModal={handleCreateModal}
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
                <VendorModal
                    data={modalData}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    handleRefresh={handleRefresh}
                />
            )}
        </Flex>
    );
};

export default VendorPage;
