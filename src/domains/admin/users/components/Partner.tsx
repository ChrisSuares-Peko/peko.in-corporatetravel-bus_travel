import React, { Suspense, useState } from 'react';

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import PartnerHeader from './PartnerHeader';
import PartnerModal from './PartnerModal';
import useFilter from '../hooks/useFilters';
import { useGetPartner } from '../hooks/useGetPartner';
import { Role } from '../types/systemUserTypes';

const Partner = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: 'createdAt',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>();
    const {
        isLoading,
        tableData,
        count,
        setRefresh,
        updateActiveStatus,
        updatePartner,
        createPartner,
        downloadReport,
    } = useGetPartner(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });

    const handleEdit = (record: Role) => {
        setModalData(record);
        setOpenModal(true);
    };

    const handleActive = (partnerId: number, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;

        updateActiveStatus({ partnerId, isActive: active });
    };

    const newPartnerModalOpen = () => {
        setModalData(null);
        setOpenModal(true);
    };

    const columns = [
        {
            title: 'Date',
            sorter: true,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Partner Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Portal URL',
            dataIndex: 'portalUrl',
            key: 'portalUrl',
            sorter: true,
            render: (portalUrl: any) => (
                <Flex vertical>
                    <Typography.Text>{portalUrl || 'Not available'}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Role) => (
                <Flex justify="start">
                    <EditOutlined onClick={() => handleEdit(record)} />
                </Flex>
            ),
        },
        {
            title: 'Status',
            sorter: true,
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: any, record: any) =>
                isActive === 1 || isActive === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.id, record.isActive)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.id, record.isActive)}
                    />
                ),
        },
    ];

    return (
        <Flex vertical gap={20}>
            <PartnerHeader
                handleDownloadReport={downloadReport}
                searchText={filters.searchText}
                handleSearch={handleSearch}
                setRefresh={setRefresh}
                handleOpenModal={newPartnerModalOpen}
            />

            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                onChange={handleTableChange}
                loading={isLoading}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
            <Suspense>
                {openModal && (
                    <PartnerModal
                        open={openModal}
                        handleCancel={() => setOpenModal(false)}
                        setRefresh={setRefresh}
                        data={modalData}
                        handleUpdate={updatePartner}
                        handleCreate={createPartner}
                    />
                )}
            </Suspense>
        </Flex>
    );
};

export default Partner;
