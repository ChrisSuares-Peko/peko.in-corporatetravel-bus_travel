import React, { useEffect, useMemo, useState } from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Table } from 'antd';
import { debounce } from 'lodash';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { formattedDateTime } from '@utils/dateFormat';

import CustomerHeader from './CustomerHeader';
import CustomerModal from './CustomerModal';
import { useCustomers } from '../../hooks/useCustomers';
import useFilter from '../../hooks/useFilter';

type Props = {};

const CustomerTable = (props: Props) => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
    };
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalData, setModalData] = useState<any>();
    const { isLoading, tableData, count, setRefresh, customerDelete } = useCustomers(filters);
    // const { customerDelete } = useCustomerAdd();
    const { handleSearch, handlePageChange, searchText } = useFilter({
        setFilters,
    });
    // const handleActive = (docId: number | string, status: any) => {
    //     let active;
    //     if (status === 1 || status === true) active = false;
    //     else active = true;
    //     updateActiveStatus({ docId, status: active });
    // };

    const debouncedSetFilters = useMemo(
        () =>
            debounce((newSearchText: string) => {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    searchText: newSearchText,
                    page: 1,
                }));
            }, 500),
        []
    );

    useEffect(() => {
        debouncedSetFilters(searchText);
        return () => {
            debouncedSetFilters.cancel();
        };
    }, [searchText, debouncedSetFilters]);

    const handleEdit = (record: Document) => {
        setModalData(record);
        setOpenModal(true);
    };
    const handleAdd = () => {
        setOpenModal(true);
    };
    const handleDelete = () => {
        customerDelete(modalData?.id);
        setDeleteModal(false);
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: any) => formattedDateTime(new Date(createdAt)),
        },
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email ID',
            dataIndex: 'email',
            // render: (category: any) => <Typography.Text>{category?.categoryName}</Typography.Text>,
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            // render: (description: any) => <Typography.Text>{description}</Typography.Text>,
        },
        {
            title: 'TRN Number',
            dataIndex: 'trnNo',
            key: 'trnNo',
        },

        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
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
            <CustomerHeader
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={searchText}
            />
            {/* <Flex justify="space-between">
                <Typography.Text />

                <Button
                    type="primary"
                    className="w-fit mt-8"
                    danger
                    onClick={handleAdd}
                    // loading={isLoading}
                >
                    <Typography.Text className="text-white font-medium text-xs">
                        Add Customer
                    </Typography.Text>
                </Button>
            </Flex> */}
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                scroll={{ x: 756 }}
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
                <CustomerModal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}{' '}
            {deleteModal && (
                <ConfirmationModal
                    handleSubmit={handleDelete}
                    handleCancel={() => setDeleteModal(false)}
                    isOpen={deleteModal}
                    title="Are you sure you want to delete the customer?"
                    isLoading={false}
                />
            )}
        </Flex>
    );
};

export default CustomerTable;
