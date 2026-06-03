import React, { useState } from 'react';

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Pagination, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';

import CopySVG from '@assets/svg/Copy.svg';
import GenericTable from '@components/atomic/GenericTable';
import { showToast } from '@src/slices/apiSlice';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import CouponCodeHeader from './CouponCodeHeader';
import CouponCodeModal from './CouponCodeModal';
import useFilter from '../../hooks/useFilters';
import useGetCouponCodes from '../../hooks/useGetCouponCode';
import { Coupon } from '../../types/couponCode';

const CouponCode = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC',
        deviceType: '',
        sortField: '',
    };
    const dispatch = useDispatch();
    const [filters, setFilters] = useState(initialValues);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Coupon>();
    const { handleSearch, handlePageChange, handleTableChange } = useFilter({ setFilters });
    const { isLoading, tableData, updateActiveStatus, count, setRefresh } =
        useGetCouponCodes(filters);
    const handleActive = (couponId: number | string, status: any) => {
        let active;
        if (status === 1 || status === true) active = false;
        else active = true;
        updateActiveStatus({ couponId, status: active });
    };

    const handleEdit = (record: Coupon) => {
        setModalData(record);
        setOpenModal(true);
    };

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        return dispatch(
            showToast({
                description: 'Coupon code copied to clipboard',
                variant: 'success',
            })
        );
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
            title: 'Coupon Code',
            sorter: true,
            dataIndex: 'couponCode',
            key: 'couponCode',
            render: (couponCode: string) => (
                <Flex>
                    <Typography.Text className="w-3/4 " style={{ marginRight: '8px' }}>
                        {couponCode}
                    </Typography.Text>
                    <ReactSVG
                        className="w-1/4 cursor-pointer ms-1"
                        src={CopySVG}
                        onClick={() => handleCopyClick(couponCode)}
                    />
                </Flex>
            ),
        },
        {
            title: 'Discount Type',
            sorter: true,
            dataIndex: 'discountType',
            key: 'discountType',
            render: (discountType: any) => <Typography.Text>{discountType}</Typography.Text>,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            sorter: true,
            key: 'discount',
            render: (discount: string, data: any) => (
                <Typography.Text>
                    {data.discountType === 'PERCENTAGE'
                        ? `${Number(discount)} %`
                        : `AED ${discount}`}
                </Typography.Text>
            ),
        },
        {
            title: 'Valid From',
            dataIndex: 'validFrom',
            sorter: true,
            key: 'validFrom',
            render: (validFrom: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(validFrom))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Valid To',
            dataIndex: 'validTo',
            sorter: true,
            key: 'validTo',
            render: (validTo: any) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(validTo))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            key: 'status',
            render: (status: any, record: Coupon) =>
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
            render: (_: any, record: Coupon) => (
                <Flex justify="space-between">
                    <EditOutlined onClick={() => handleEdit(record)} />
                </Flex>
            ),
        },
    ];

    return (
        <Flex vertical gap={20}>
            <CouponCodeHeader
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
                <CouponCodeModal
                    setRefresh={setRefresh}
                    data={modalData}
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                />
            )}
        </Flex>
    );
};

export default CouponCode;
