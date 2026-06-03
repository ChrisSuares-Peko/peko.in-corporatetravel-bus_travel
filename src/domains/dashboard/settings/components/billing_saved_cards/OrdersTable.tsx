import React, { useState } from 'react';

import { Col, Flex, Pagination, Table, Skeleton, Typography } from 'antd';

import getPurchaseHistoryColumns from './SubscriptionHistoryColumns';
import { useDownloadInvoice } from '../../hooks/subscriptions/useDownloadInvoice';
import useFilter from '../../hooks/subscriptions/useFilter';
import usePurchaseHistory from '../../hooks/subscriptions/usePurchaseHIstory';

type Props = {};

const OrdersTable = (props: Props) => {
    const initialValues = {
        page: 1,
        itemsPerPage: 3,
    };
    const [filters, setFilters] = useState(initialValues);
    const { handlePageChange } = useFilter({ setFilters });
    const { data, isLoading, count } = usePurchaseHistory(filters);
    const { getInvoiceData, isLoading: downloadLoading } = useDownloadInvoice();
    const [loadingRows, setLoadingRows] = useState({});
    const handleDownloadInvoice = async (recordId: number) => {
        setLoadingRows(prev => ({ ...prev, [recordId]: true }));
        try {
            await getInvoiceData(recordId);
        } finally {
            setLoadingRows(prev => ({ ...prev, [recordId]: false }));
        }
    };
    const columns = getPurchaseHistoryColumns(handleDownloadInvoice, loadingRows);
    return (
        <Col className="w-full">
            {isLoading ? (
                <Skeleton className="py-10" />
            ) : (
                <Flex className="w-full" vertical>
                    <Typography.Text className="py-5 text-lg">
                        Subscription History & Invoices
                    </Typography.Text>
                    <Table
                        rowKey={record => record.id}
                        loading={isLoading || downloadLoading}
                        className="w-full"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
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
                </Flex>
            )}
        </Col>
    );
};

export default OrdersTable;
