import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@domains/admin/manage/hooks/useFilters';

import DisabledServiceHeader from './DisabledServiceHeader';
import useGetDisabledService from '../../hooks/disableService/useGetDisabledService';
import { Service } from '../../types/disabledTypes';

const DisabledService = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
    };
    const [filters, setFilters] = useState(initialValues);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<Service>();
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    } = useGetDisabledService(filters);
    const { handleSearch, handlePageChange } = useFilter({ setFilters });
    const handleActive = (serviceId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ serviceId, serviceStatus: active });
    };

    const handleDelete = () => {
        deleteDoc(modalData!?.Id);
        setDeleteModal(false);
    };
    const columns = [
        // {
        //     title: 'Date',
        //     dataIndex: 'createdAt',
        //     key: 'createdAt',
        //     render: (createdAt: any) => formattedDateTime(new Date(createdAt))
        // },
        {
            title: 'Service Operator',
            dataIndex: 'serviceProvider',
            key: 'serviceProvider',
        },
        {
            title: 'Corporate ID',
            dataIndex: 'credentialId',
            key: 'credentialId',
        },

        {
            title: 'Corporate Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'serviceStatus',
            key: 'serviceStatus',
            render: (status: any, record: Service) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.Id, record.serviceStatus)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.Id, record.serviceStatus)}
                    />
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Service) => (
                <DeleteOutlined
                    className=" text-brandColor"
                    onClick={() => {
                        setModalData(record);
                        setDeleteModal(true);
                    }}
                />
            ),
        },
    ];
    return (
        <Flex vertical gap={20}>
            <DisabledServiceHeader
                downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.Id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
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

export default DisabledService;
