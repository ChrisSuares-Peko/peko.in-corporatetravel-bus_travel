import React from 'react';

import { Col, Row, Typography } from 'antd';

import Headers from './Headers';
import Table from './Table';
import useFilter from '../hooks/useFilter';
import useReportExcelCSVPDFListing from '../hooks/useReportListing';
import { filterOption, filterState, transactionType } from '../types';

interface tableProps {
    title: string;
    category: filterOption[];
    filter: filterState;
    setFilter: (value: any) => void;
    handleFilterChange: (value: any) => void;
    initalStartDate: string;
    initalEndDate: string;
    data: transactionType[];
    isLoading: boolean;
    count: number | undefined;
    initialValues: filterState;
    isCashbackTable?: boolean;
}
const ReportTables = ({
    data,
    count,
    isLoading,
    title,
    category,
    filter,
    setFilter,
    initalStartDate,
    initalEndDate,
    initialValues,
    isCashbackTable = false,
    handleFilterChange,
}: tableProps) => {
    const { downloadReport } = useReportExcelCSVPDFListing(filter, title);
    const {
        handleSearch,
        handleChangeFilters,
        handlePageChange,
        handleFilter,
        handleSort,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleTableChange,
    } = useFilter({ setFilter, initalStartDate, initalEndDate });
    return (
        <Row gutter={[0, 20]}>
            <Col span={24}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Typography.Title level={4} style={{ fontWeight: 400 }}>
                            {title}
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Headers
                            text={title}
                            category={category}
                            from={filter.from}
                            to={filter.to}
                            initialFrom={initialValues.from} // Pass initial from date
                            initialTo={initialValues.to} // Pass initial to date
                            handleChangeFilters={handleChangeFilters}
                            handleDateChange={handleDateChange}
                            handleSearch={handleSearch}
                            handleFromChange={handleFromChange}
                            handleToChange={handleToChange}
                            handleDownloadReport={downloadReport}
                            isLoading={isLoading}
                            searchText={filter.searchText}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    handleFilterChange={handleFilterChange}
                    filter={filter.filter}
                    page={filter.page}
                    data={data}
                    isLoading={isLoading}
                    count={count}
                    handlePageChange={handlePageChange}
                    isCashbackTable={isCashbackTable}
                    handleSort={handleSort}
                    handleFilter={handleFilter}
                    handleTableChange={handleTableChange}
                />
            </Col>
        </Row>
    );
};

export default ReportTables;
