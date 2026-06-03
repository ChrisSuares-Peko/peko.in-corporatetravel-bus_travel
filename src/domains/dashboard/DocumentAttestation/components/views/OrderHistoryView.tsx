import React, { useState } from 'react';

import { Grid, Pagination } from 'antd';

import useDebounce from '@src/hooks/useDebounce';

import useGetOrdersList from '../../hooks/useGetOrdersList';
import OrderHistoryMobileView from '../sections/OrderHistoryMobileView';
import OrderHistoryPage from '../sections/OrderHistoryPage';

type OrderHistoryViewProps = {};

const OrderHistoryView: React.FC<OrderHistoryViewProps> = () => {
    const { useBreakpoint } = Grid;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebounce(searchText, 500);
    const { ordersList, totalOrders, isLoading } = useGetOrdersList(
        currentPage,
        debouncedSearchText
    );
    const screens = useBreakpoint();
    return (
        <>
            {screens.md ? (
                <OrderHistoryPage
                    setSearchKey={setSearchText}
                    ordersList={ordersList ?? []}
                    isLoading={isLoading}
                />
            ) : (
                <OrderHistoryMobileView
                    setSearchKey={setSearchText}
                    ordersList={ordersList ?? []}
                />
            )}
            <Pagination
                className="sm:text-end text-center mt-10"
                defaultPageSize={10}
                defaultCurrent={1}
                size="small"
                total={totalOrders}
                onChange={(pageCount, pageSize) => {
                    setCurrentPage(pageCount);
                }}
            />
        </>
    );
};

export default OrderHistoryView;
