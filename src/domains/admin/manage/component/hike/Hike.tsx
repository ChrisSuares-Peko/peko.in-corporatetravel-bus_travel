import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Image, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import HikeHeader from './HikeHeader';
import HikeModal from './HikeModal';
import useGetAllHike from '../../hooks/hike/useGetAllHike';
import useFilter from '../../hooks/useFilters';

const Hike = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>();
    const { tableData, count, loading, setRefresh, updateActiveStatusHike } =
        useGetAllHike(filters);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    // const { isLoading, statusUpdate,setRefresh } = useUpdateCorporateTax();
    const handleEdit = (record: any) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleActive = (id: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatusHike({ id, status: active });
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
            title: 'Name',
            sorter: true,
            dataIndex: 'name',
            key: 'name',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },

        {
            title: 'Features',
            sorter: true,
            dataIndex: 'features',
            key: 'features',
            width: 400,
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Plan Type',
            dataIndex: 'planType',
            sorter: true,
            key: 'planType',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: true,
            key: 'amount',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (image: string) =>
                image ? <Image src={image} height={30} width={30} /> : 'N/A',
        },
        {
            title: 'Partners',
            dataIndex: 'partners',
            key: 'partners',
            render: (image: string) =>
                image ? <Image src={image} height={30} width={30} /> : 'N/A',
        },
        {
            title: 'Salary Amount',
            dataIndex: 'salaryAmount',
            sorter: true,
            key: 'salaryAmount',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },
        {
            title: 'Salary Validation',
            dataIndex: 'salaryValidation',
            sorter: true,
            key: 'salaryValidation',
            render: (data: any) => <Typography.Text>{data || '-'}</Typography.Text>,
        },

        {
            title: 'Status',
            sorter: true,
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: any) =>
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
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
                <Flex justify="space-between">
                    <EditOutlined onClick={() => handleEdit(record)} />
                </Flex>
            ),
        },
    ];
    return (
        <Flex vertical gap={20}>
            <HikeHeader
                // downloadReport={downloadReport}
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={loading}
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
                <HikeModal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}
        </Flex>
    );
};

export default Hike;
