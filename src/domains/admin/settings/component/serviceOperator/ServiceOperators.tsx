import React, { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';

import OperatorHeader from './Header';
import OperatorModal from './OperatorModal';
import useFilter from '../../../manage/hooks/useFilters';
import useOperatorData from '../../hooks/useOperator';
import { serviceOperator } from '../../types/serviceOperator';
import getOperatorColumns from '../../utils/table_column/OperatorColumns';

const ServiceOperatorPage = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<serviceOperator>();
    const { isLoading, tableData, count, handleRefresh, updateActiveStatus, downloadReport } =
        useOperatorData(filters);
    const {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        setSearchText,
        handleTableChange,
    } = useFilter({
        setFilters,
    });

    const handleActive = (operatorId: number | string, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ operatorId, serviceStatus: active });
    };
    const handleEdit = (record: serviceOperator) => {
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
    const columns = getOperatorColumns({ handleActive, handleEdit });
    return (
        <Flex vertical gap={20}>
            <OperatorHeader
                downloadReport={downloadReport}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                setSearchText={setSearchText}
                searchText={filters.searchText}
                setOpenModal={handleCreateModal}
            />
            <GenericTable
                rowKey={record => record.id!}
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
                <OperatorModal
                    data={modalData}
                    open={openModal}
                    handleCancel={handleCloseModal}
                    handleRefresh={handleRefresh}
                />
            )}
        </Flex>
    );
};

export default ServiceOperatorPage;
