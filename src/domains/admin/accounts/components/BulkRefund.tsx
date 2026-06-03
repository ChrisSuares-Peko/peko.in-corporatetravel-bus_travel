import React, { useState } from 'react';

import { Flex, Spin } from 'antd';
import dayjs from 'dayjs';

import BulkRefundHeader from './BulkRefundHeader';
import BulkRefundTable from './BulkRefundTable';
import useBulkUpload from '../hooks/useBulkUpload';
import useFilter from '../hooks/useFilter';
import useGetCorporate from '../hooks/useGetCorporate';
import { categoryData } from '../utils/bulkRefundData';

const BulkRefund = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const initialFilters = {
        searchText: '',
        category: '',
        corporateId: '',
        from: todayFormatted,
        to: todayFormatted,
        page: 1,
    };
    const [filters, setFilters] = useState(initialFilters);
    const [search, setSearch] = useState<string>('');
    const { tableData, isLoading, bulkPaymentApi, getOtp, loader, otpLoader } =
        useBulkUpload(filters);
    const { corporateList } = useGetCorporate(search);
    const { handleDateChange, handleSearch, handleCategoryFilters, handleChangeCorporate } =
        useFilter({ initalEndDate: filters.to, initalStartDate: filters.from, setFilters });
    return (
        <>
            <BulkRefundHeader
                searchCorporate={search}
                setSearchCorporate={setSearch}
                categoryDatas={corporateList}
                from={filters.from}
                to={filters.to}
                searchText={filters.searchText}
                handleCategoryFilters={handleChangeCorporate}
                handleDateChange={handleDateChange}
                handleSearch={handleSearch}
            />
            {tableData ? (
                <BulkRefundTable
                    bulkPaymentApi={bulkPaymentApi}
                    getOtp={getOtp}
                    loader={loader}
                    otpLoader={otpLoader}
                    tableData={tableData!}
                    isLoading={isLoading}
                    categoryDatas={categoryData}
                    handleCategoryFilters={handleCategoryFilters}
                />
            ) : (
                <Flex vertical align="center" justify="center" gap={15} className="mt-20">
                    <Spin className="my-auto" size="large" />
                </Flex>
            )}
        </>
    );
};

export default BulkRefund;
