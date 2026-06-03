import React, { useState } from 'react';

import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import Header from './Header';
import useConnectionRequests from '../../hooks/useConnectionRequests';
import useFilter from '../../hooks/useFilter';

const ConnectionRequests = () => {
    const initialValues = {
        searchText: '',
        category: '',
        sort: 'DESC',
        sortField: '',
        page: 1,
        itemsPerPage: 10,
    };
    const [filters, setFilters] = useState(initialValues);
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({
        setFilters,
    });
    const { isLoading, tableData, count, downloadReport } = useConnectionRequests(filters);
    const columns = [
        {
            title: 'Request Date',
            dataIndex: 'createdAt',
            sorter: true,
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
            key: 'createdAt',
        },
        {
            title: 'Request ID',
            sorter: true,
            dataIndex: 'id',
        },
        {
            title: 'Corporate ID',
            dataIndex: ['credential', 'username'],
            sorter: true,
            render: (_: any, data: any) => (
                <Typography.Text>{data?.credential.username ?? '-'}</Typography.Text>
            ),
        },
        {
            title: 'Corporate Name',
            sorter: true,
            dataIndex: 'name',
        },
        {
            title: 'Partner Name',
            sorter: true,
            dataIndex: ['credential', 'registeredBy'],
            render: (_: any, data: any) => (
                <Typography.Text>
                    {data?.credential?.registeredByCredential?.name ?? '-'}
                </Typography.Text>
            ),
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Email ID',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Requirements',
            dataIndex: 'requirement',
            key: 'requirement',
            sorter: true,
            width: 400,
            render: (requirement: any, data: any) => (
                <Typography.Text> {requirement || '-'} </Typography.Text>
            ),
        },
        {
            title: 'Service Provider',
            dataIndex: 'serviceProvider',
            key: 'serviceProvider',
            sorter: true,
        },
    ];
    return (
        <Flex vertical gap={20}>
            <Header
                handleDownloadReport={downloadReport}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                style={{ overflow: 'auto' }}
                // scroll={{ x: 992 }}
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
        </Flex>
    );
};

export default ConnectionRequests;
