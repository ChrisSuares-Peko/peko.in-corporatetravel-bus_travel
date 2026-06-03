import React, { useState, useMemo, useCallback } from 'react';

import { Flex, Row, Typography, Tabs, Col, Grid, Skeleton } from 'antd';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';

import { useAppSelector } from '@src/hooks/store';

import ReportScheduling from '../components/ReportScheduling';
import ReportTables from '../components/ReportTables';
import { useGetCashbackData } from '../hooks/useGetCashbackData';
import { useGetCategories } from '../hooks/useGetCategories';
import { useGetReportsApi } from '../hooks/useGetReportsApi';

const { useBreakpoint } = Grid;
const Reports: React.FC = () => {
    const screens = useBreakpoint();
    const size = screens.md ? 'large' : 'small';
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    // Memoize initialValues to avoid re-creation on every render
    const initialValues = useMemo(
        () => ({
            searchText: '',
            category: '',
            sort: 'DESC',
            page: 1,
            itemsPerPage: 10,
            filter: '',
            from: todayFormatted,
            to: todayFormatted,
            sortField: '',
        }),
        [todayFormatted]
    );

    const [transactionFilters, setTransactionFilters] = useState(initialValues);
    const [cashbackFilters, setCashbackFilters] = useState(initialValues);
    const { category } = useGetCategories();
    const { orderCount, orderData, orderLoading, initailLoader } = useGetReportsApi(
        transactionFilters.searchText,
        transactionFilters.category,
        transactionFilters.sort,
        transactionFilters.page,
        transactionFilters.itemsPerPage,
        transactionFilters.filter,
        transactionFilters.from,
        transactionFilters.to,
        transactionFilters.sortField
    );
    const handleFilterChange = (newFilterValue: string) => {
        setTransactionFilters(prevFilters => {
            // Only update filters if the value has changed
            if (prevFilters.filter !== newFilterValue) {
                return {
                    ...prevFilters,
                    filter: newFilterValue,
                };
            }
            return prevFilters; // No change, avoid re-render
        });
    };
    const { cashbackCount, cashbackLoading, cashbackdata } = useGetCashbackData(
        cashbackFilters.searchText,
        cashbackFilters.category,
        cashbackFilters.sort,
        cashbackFilters.page,
        cashbackFilters.itemsPerPage,
        cashbackFilters.filter,
        cashbackFilters.from,
        cashbackFilters.to,
        cashbackFilters.sortField
    );
    let items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Transactions',
            children: (
                <ReportTables
                    data={orderData}
                    count={orderCount}
                    isLoading={orderLoading}
                    title="Transactions"
                    category={category}
                    filter={transactionFilters}
                    setFilter={setTransactionFilters}
                    handleFilterChange={handleFilterChange}
                    initalStartDate={initialValues.from}
                    initalEndDate={initialValues.to}
                    initialValues={initialValues}
                />
            ),
        },
        {
            key: '2',
            label: 'Cashbacks',
            children: (
                <ReportTables
                    handleFilterChange={handleFilterChange}
                    data={cashbackdata}
                    count={cashbackCount}
                    isLoading={cashbackLoading}
                    title="Cashbacks"
                    category={category}
                    filter={cashbackFilters}
                    setFilter={setCashbackFilters}
                    initalStartDate={initialValues.from}
                    initalEndDate={initialValues.to}
                    initialValues={initialValues}
                    isCashbackTable
                />
            ),
        },
        {
            key: '3',
            label: 'Scheduling Reports',
            children: <ReportScheduling />,
        },
    ];

    const handleTabChange = useCallback(
        (activeKey: string) => {
            if (activeKey === '1') {
                setTransactionFilters(prev => ({
                    ...prev,
                    ...initialValues,
                }));
            } else if (activeKey === '2') {
                setCashbackFilters(prev => ({
                    ...prev,
                    ...initialValues,
                }));
            }
        },
        [initialValues]
    );

    const { user } = useAppSelector(state => state.reducer.user);
    if (user?.roleName === 'corporate sub user') {
        items = items.slice(0, 1); // Keep only the first element for the sub corporate
    }

    return (
        <Row>
            <Col span={24}>
                {initailLoader ? (
                    <>
                        <Typography.Text className=" font-medium text-lg sm:text-xl">
                            Reports
                        </Typography.Text>
                        <Skeleton paragraph={{ rows: 12 }} className="mt-16" />
                    </>
                ) : (
                    <Flex vertical gap={20}>
                        <Typography.Text className=" font-medium text-lg sm:text-xl">
                            Reports
                        </Typography.Text>
                        <Tabs
                            size={size}
                            defaultActiveKey="1"
                            items={items}
                            onChange={handleTabChange}
                        />
                    </Flex>
                )}
            </Col>
        </Row>
    );
};

export default Reports;
