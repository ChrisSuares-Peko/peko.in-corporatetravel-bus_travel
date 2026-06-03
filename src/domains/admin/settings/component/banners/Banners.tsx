import React, { useState } from 'react';

import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';
import { Link } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import useFilter from '@src/domains/admin/manage/hooks/useFilters';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import BannersHeader from './BannersHeader';
import BannersModal from './BannersModal';
import useGetBanner from '../../hooks/useGetBanner';
import { Banner } from '../../types/banners';

const Banners = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        deviceType: '',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<Banner>();
    const {
        isLoading,
        tableData,
        count,
        deleteDoc,
        setRefresh,
        updateActiveStatus,
        downloadReport,
    } = useGetBanner(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const handleEdit = (record: Banner) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleDelete = () => {
        deleteDoc(modalData!?.id);
        setDeleteModal(false);
    };
    const handleActive = (bannerId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ bannerId, status: active });
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            sorter: true,
            key: 'createdAt',
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Banner Link',
            sorter: true,
            dataIndex: 'bannerLink',
            key: 'bannerLink',
        },
        {
            title: 'Device Type',
            sorter: true,
            dataIndex: 'deviceType',
            key: 'deviceType',
            render: (deviceType: any) => <Typography.Text>{deviceType}</Typography.Text>,
        },
        {
            title: 'Position',
            sorter: true,
            dataIndex: 'position',
            key: 'position',
            render: (position: any) => <Typography.Text>{position ?? '-'}</Typography.Text>,
        },
        {
            title: 'Partner Id',
            sorter: true,
            dataIndex: 'partnerId',
            key: 'partnerId',
            render: (partnerId: any) => <Typography.Text>{partnerId ?? '-'}</Typography.Text>,
        },
        {
            title: 'Banner Image',
            dataIndex: 'bannerImage',
            render: (bannerImage: any) => (
                <Link
                    to={bannerImage}
                    target="_blank" // Open link in new tab
                    rel="noopener noreferrer"
                >
                    <EyeOutlined />
                </Link>
            ),
            key: 'bannerImage',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            key: 'status',
            render: (status: any, record: Banner) =>
                status === 1 || status === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.id, record.status)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.id, record.status)}
                    />
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Banner) => (
                <Flex justify="space-between">
                    <EditOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined
                        className=" text-brandColor"
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
            <BannersHeader
                downloadReport={downloadReport}
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
                <BannersModal
                    setRefresh={setRefresh}
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

export default Banners;
