import React, { useEffect, useState } from 'react';

import {
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import { useAppSelector } from '@src/hooks/store';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CorporateUserHeader from './CorporateUserHeader';
import EditCorporateUserDetails from './EditCorporateUserDetails';
import useFilter from '../hooks/useFilters';
import useGetCorporateUserData from '../hooks/useGetCorporateUserData';
import usePartnersForCorporate from '../hooks/usePartnersForCorporate';
import { Data } from '../types/corporateUserTypes';

const CorporateUser = () => {
    const { user } = useAppSelector(state => state.reducer.user);

    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        partnerId: '',
        sort: 'DESC',
        sortField: 'createdAt',
    };
    const [filters, setFilters] = useState(initialValues);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    useEffect(() => {
        setFilters({
            searchText: '',
            page: 1,
            itemsPerPage: 10,
            sort: 'DESC',
            sortField: 'createdAt',
            partnerId: user?.partnerId || '',
        });
        if (user?.partnerId) setIsDisabled(true);
    }, [user]);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Data>();
    const {
        handleSearch,
        handlePageChange,
        handleChangeFilters,
        searchText,
        setSearchText,
        handleTableChange,
    } = useFilter({ setFilters });
    const {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        updateCorporateUserData,
        kycStatus,
        packageData,
        downloadReport,
    } = useGetCorporateUserData(filters);
    const { categoryDatas } = usePartnersForCorporate(searchText);
    const handleActive = (corporateId: number | string, isActive: any) => {
        let active;
        if (isActive === 1 || isActive === true) active = false;
        else active = true;
        updateActiveStatus({ corporateId, isActive: active });
    };
    const handleEdit = (record: Data) => {
        setModalData(record);
        setOpenModal(true);
    };
    const columns = [
        {
            title: 'Date',
            sorter: true,
            dataIndex: 'createdAt',
            render: (createdAt: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
                </Flex>
            ),
            key: 'createdAt',
        },
        {
            title: 'Corporate Name / Account ID',
            dataIndex: ['credential', 'username'],
            sorter: true,
            render: (companyName: any, record: Data) => (
                <Flex vertical>
                    <Typography.Text>{record.name}</Typography.Text>
                    <Typography.Text>{record.credential.username}</Typography.Text>
                </Flex>
            ),
            key: 'companyName',
        },
        {
            title: 'Contact Details',
            dataIndex: 'email',
            render: (email: any, record: Data) => (
                <Flex vertical>
                    <Flex gap={8}>
                        <MailOutlined />
                        <Typography.Text>{email}</Typography.Text>
                    </Flex>
                    <Flex gap={8}>
                        <PhoneOutlined />
                        <Typography.Text>{record.mobileNo}</Typography.Text>
                    </Flex>
                </Flex>
            ),
            key: 'email',
        },
        {
            title: 'Partner ID',
            sorter: true,
            dataIndex: ['credential', 'partnerId'],
            render: (data: any, record: any) => (
                <Typography.Text>{record.credential.registeredBy || 'N/A'}</Typography.Text>
            ),
            key: 'PartnerId',
        },
        {
            title: 'Partner Name',
            dataIndex: 'partnerName',
            render: (data: any, record: any) => (
                <Typography.Text>{record?.partnerName || 'N/A'}</Typography.Text>
            ),
            key: 'partnerName',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            render: (amount: string) => `AED ${formatNumberWithLocalString(amount)}`,
            key: 'balance',
        },
        {
            title: 'City',
            dataIndex: 'city',
            sorter: true,
            key: 'city',
            render: (text: string) => text || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            sorter: true,
            render: (isActive: any, record: Data) =>
                isActive === 1 || isActive === true ? (
                    <CheckOutlined
                        className="cursor-pointer text-textLime"
                        onClick={() => handleActive(record.credentialId, record.isActive)}
                    />
                ) : (
                    <CloseOutlined
                        className="cursor-pointer text-brandColor"
                        onClick={() => handleActive(record.credentialId, record.isActive)}
                    />
                ),
        },
        {
            title: 'Edit',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Data) => <EditOutlined onClick={() => handleEdit(record)} />,
        },
    ];

    return (
        <Flex vertical gap={20}>
            <CorporateUserHeader
                handleDownloadReport={downloadReport}
                handleChangeFilters={handleChangeFilters}
                handleSearch={handleSearch}
                setSearchText={setSearchText}
                searchText={filters.searchText}
                categoryDatas={categoryDatas}
                isDisabled={isDisabled}
                partnerSelected={filters.partnerId}
            />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                onChange={handleTableChange}
                // scroll={{ x: 756 }}
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
                <EditCorporateUserDetails
                    packageData={packageData}
                    data={modalData}
                    open={openModal}
                    updateCorporateUserData={updateCorporateUserData}
                    handleCancel={() => setOpenModal(false)}
                    kycStatus={kycStatus}
                />
            )}
        </Flex>
    );
};

export default CorporateUser;
