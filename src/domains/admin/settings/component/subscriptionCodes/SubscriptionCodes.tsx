import React from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';

import SubscriptionCodesHeader from './SubscriptionCodesHeader';
import SubscriptionCodesModal from './SubscriptionCodesModal';
import useSubscriptionCodeTable from '../../hooks/subscriptionCodes/useSubscriptionCodeTable';
import useUpdateCodes from '../../hooks/subscriptionCodes/useUpdateCodes';

const SubscriptionCodes = () => {
    const {
        columns,
        filters,
        setFilters,
        modalData,
        openModal,
        closeFormModal,
        deleteModal,
        closeDeleteModal,
        tableData,
        count,
        isLoading,
        setRefresh,
    } = useSubscriptionCodeTable();
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const { deleteActivationCode, isLoading: deleteLoader } = useUpdateCodes({
        handleCancel: closeDeleteModal,
        setRefresh,
    });

    return (
        <Flex vertical gap={20}>
            <SubscriptionCodesHeader
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
                <SubscriptionCodesModal
                    data={modalData}
                    open={openModal}
                    handleCancel={closeFormModal}
                    setRefresh={setRefresh}
                />
            )}
            {deleteModal && (
                <ConfirmationModal
                    handleSubmit={() => deleteActivationCode(modalData!?.id)}
                    handleCancel={closeDeleteModal}
                    isOpen={deleteModal}
                    title="Do you want to proceed with the deletion?"
                    isLoading={deleteLoader}
                />
            )}
        </Flex>
    );
};

export default SubscriptionCodes;
