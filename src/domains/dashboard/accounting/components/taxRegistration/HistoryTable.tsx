import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Pagination, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import useFilter from '@domains/dashboard/accounting/hooks/useCorporateFilter';
import useGetCorporateTaxHistory from '@domains/dashboard/accounting/hooks/useCorporateTaxHistory';
import { TaxDetails, taxUpdate } from '@domains/dashboard/accounting/slices/accountingSlice';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { Record } from '../../types/types';

const HistoryTable = () => {
    const dispatch = useAppDispatch();
    const initialValues = {
        searchText: '',
        page: 1,
        pageSize: 10,
    };
    const [filters, setFilters] = useState(initialValues);

    const { tableData, count, isLoading } = useGetCorporateTaxHistory(filters);
    const { handleSearch, handlePageChange } = useFilter({ setFilters });
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (data: any) => (
                <Typography.Text>{formattedDateTime(new Date(data))}</Typography.Text>
            ),
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        // {
        //     title: 'Corporate Name',
        //     dataIndex: 'credential',
        //     render: (data: any) => <Typography.Text>{data.name}</Typography.Text>,
        // },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
        },
        {
            title: 'Email ID',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let statusStyle = {
                    color: '#C89C00',
                    fontWeight: '500',
                };
                if (status.toLowerCase() === 'pending') {
                    statusStyle = {
                        color: '#C89C00',
                        fontWeight: '500',
                    };
                }
                if (status.toLowerCase() === 'completed') {
                    statusStyle = {
                        color: 'green',
                        fontWeight: '500',
                    };
                }
                if (status.toLowerCase() === 're upload') {
                    statusStyle = {
                        color: 'red',
                        fontWeight: '500',
                    };
                }
                return (
                    <Flex style={statusStyle}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Flex>
                );
            },
        },
        // {
        //     title: 'View',
        //     key: 'view',

        //     render: (_: any, record: Record) => (
        //         <Typography.Text
        //             className="cursor-pointer"
        //             style={{ color: '#FF3A3A' }}
        //             onClick={() => {
        //                 dispatch(TaxDetails(record));
        //                 navigate(paths.accounting.TaxOrderDetails);
        //             }}
        //         >
        //             View Details
        //         </Typography.Text>
        //     ),
        //     width: '10%',
        // },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Record) => {
                if (record.status === 'RE UPLOAD') {
                    return (
                        // <Flex justify="space-between">
                        //     <EditOutlined
                        //         onClick={() => {
                        //             dispatch(TaxDetails(record));
                        //             navigate('/accounting/corporate-tax-registration');
                        //         }}
                        //     />
                        // </Flex>
                        <Typography.Text
                            className="cursor-pointer"
                            style={{ color: '#FF3A3A' }}
                            onClick={() => {
                                dispatch(taxUpdate(record));
                                navigate('/accounting/corporate-tax-registration');
                            }}
                        >
                            Update
                        </Typography.Text>
                    );
                }
                return (
                    <Typography.Text
                        className="cursor-pointer"
                        style={{ color: '#FF3A3A' }}
                        onClick={() => {
                            dispatch(TaxDetails(record));
                            navigate(paths.accounting.TaxOrderDetails);
                        }}
                    >
                        View
                    </Typography.Text>
                );
            },
        },
    ];
    return (
        <Flex vertical gap={20}>
            {/* <TaxHeader
                setRefresh={setRefresh}
                handleSearch={handleSearch}
                searchText={filters.searchText}
            /> */}
            {/* <Input
                    value={filters.searchText}
                    placeholder="Search "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                /> */}
            <Flex justify="space-between" className="mb-4">
                <Typography.Paragraph className={`text-xl  font-medium `}>
                    Order History
                </Typography.Paragraph>
                <Flex align="center">
                    <Input
                        value={filters.searchText}
                        placeholder="Search "
                        suffix={<SearchOutlined />}
                        onChange={handleSearch}
                        allowClear
                        type="text"
                        variant="outlined"
                        maxLength={100}
                    />
                </Flex>
            </Flex>
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
        </Flex>
    );
};

export default HistoryTable;
