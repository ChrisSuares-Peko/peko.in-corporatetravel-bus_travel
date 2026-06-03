import React, { useState, Suspense } from 'react';

import { Col, Flex, Pagination, Row, Table, Typography } from 'antd';
import { debounce } from 'lodash';

import DrawerModal from '@components/atomic/DrawerModal';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';

import SelectServiceModal from './user_management/SelectServiceModal';
import UserHeader from './user_management/UserHeader';
import useCrud from '../hooks/user_management/useCrud';
import useFilter from '../hooks/user_management/useFilter';
import useGetAllSubCorporate from '../hooks/user_management/useGetAllSubCorporate';
import { SubCorporate, SubCorporateQueryParams } from '../types/userManagement';
import { SubCorporateColumns } from '../utils/tableColumn';

const UserManagement = () => {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openServiceView, setOpenServiceView] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<SubCorporate>();
    const [actionType, setActionType] = useState<'DELETE' | 'ACTIVE' | 'INACTIVE'>();

    const initialValues = {
        page: 1,
        itemsPerPage: 10,
        searchText: '',
        reload: false,
    };
    const [filters, setFilters] = useState<SubCorporateQueryParams>(initialValues);
    const { data, isLoading, count } = useGetAllSubCorporate(filters);
    const { handlePageChange, handleSearch, reloadTable } = useFilter({ setFilters });
    const debounceSearch = debounce((searchQuery: string) => handleSearch(searchQuery), 600);

    const handleCancel = () => setOpenConfirmationModal(false);
    const {
        deleteSubUser,
        isLoading: deleteLoader,
        blockSubUser,
        resendInvite,
    } = useCrud({ reloadTable, handleCancel });
    return (
        <>
            <Row className="mt-4" gutter={[0, 20]}>
                <Col span={24}>
                    <UserHeader
                        reloadTable={reloadTable}
                        filters={filters}
                        handleSearch={debounceSearch}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        columns={SubCorporateColumns(
                            setOpenEditModal,
                            setSelectedRow,
                            setOpenConfirmationModal,
                            resendInvite,
                            setActionType,
                            setOpenServiceView
                        )}
                        scroll={{ x: 992 }}
                        dataSource={data}
                        pagination={false}
                        style={{ overflow: 'auto' }}
                        loading={isLoading}
                        rowKey={record => record.id}
                    />
                    <Pagination
                        current={filters.page}
                        pageSize={filters.itemsPerPage}
                        size="default"
                        className="text-end pt-7"
                        onChange={handlePageChange}
                        total={count}
                        showSizeChanger={false}
                    />
                </Col>
            </Row>
            {openEditModal && selectedRow ? (
                <SelectServiceModal
                    open={openEditModal}
                    handleCancel={() => setOpenEditModal(false)}
                    selectedRow={selectedRow}
                    reloadTable={reloadTable}
                />
            ) : (
                ''
            )}

            <Suspense>
                {selectedRow && actionType ? (
                    <ConfirmationModal
                        isOpen={openConfirmationModal}
                        handleCancel={handleCancel}
                        title={
                            // eslint-disable-next-line no-nested-ternary
                            actionType === 'DELETE'
                                ? 'Are you sure you want to delete this user?'
                                : actionType === 'ACTIVE'
                                  ? 'Are you sure you want to unblock this user?'
                                  : 'Are you sure you want to block this user?'
                        }
                        handleSubmit={() => {
                            if (actionType === 'DELETE') {
                                deleteSubUser(selectedRow.id!);
                            } else if (actionType === 'ACTIVE') {
                                blockSubUser(selectedRow.id, 'ACTIVE');
                            } else {
                                blockSubUser(selectedRow.id, 'INACTIVE');
                            }
                        }}
                        isLoading={deleteLoader}
                    />
                ) : null}

                {openServiceView && (
                    <DrawerModal
                        open={openServiceView}
                        handleCancel={() => setOpenServiceView(false)}
                        modalTitle="List of service"
                        closeIcon
                    >
                        <Flex vertical gap={10} className="px-">
                            {selectedRow && selectedRow?.services.length > 0 ? (
                                selectedRow?.services.map(({ label }, i) => (
                                    <Typography.Text className="text-base font-medium">
                                        {label}
                                    </Typography.Text>
                                ))
                            ) : (
                                <Flex align="center" justify="center" className="h-screen">
                                    <Typography.Text className="text-base font-medium">
                                        No services available
                                    </Typography.Text>
                                </Flex>
                            )}
                        </Flex>
                    </DrawerModal>
                )}
            </Suspense>
        </>
    );
};

export default UserManagement;
