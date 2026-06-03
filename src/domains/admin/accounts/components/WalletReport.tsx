import React, { useState } from 'react';

import { SwapRightOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Pagination, Row, Select, TableProps } from 'antd';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import { DownloadType } from '@customtypes/general';
import useScreenSize from '@src/hooks/useScreenSize';

import useFilter from '../hooks/useFilter';
import useGetCorporate from '../hooks/useGetCorporate';
import { useWalletReportsApi } from '../hooks/useWalletReport';
import { dateFormat, disabledDate, initialFilters } from '../utils/data';
import { walletReportcolumns } from '../utils/walletReportColumns';

type Props = {};

const WalletReport = (props: Props) => {
    const [filters, setFilters] = useState(initialFilters);
    const { corporateList, isLoading: CorporateListLoading } = useGetCorporate();

    const {
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleChangeCorporate,
        handleSort,
    } = useFilter({
        setFilters,
        initalStartDate: filters.from,
        initalEndDate: filters.to,
    });
    const { data, isLoading, count, downloadReport } = useWalletReportsApi(
        filters.from,
        filters.to,
        filters.page,
        filters.sort,
        filters.searchText!,
        filters.corporateId,
        filters.sortField
    );
    const { xs } = useScreenSize();
    const handleTableChange: TableProps<any>['onChange'] = (pagination, filter, sorter) => {
        let sort;
        let field;

        if (Array.isArray(sorter)) {
            if (sorter.length > 0) {
                field = sorter[0].field;
                sort = sorter[0].order === 'ascend' ? 'ASC' : 'DESC';
            }
        } else {
            field = sorter.field;
            sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        }

        if (field) {
            handleSort(field.toString(), sort);
        }
    };

    return (
        <>
            <Row justify="space-between" className="w-full gap-5">
                <Flex className="flex justify-start gap-3">
                    <Button danger onClick={() => downloadReport(DownloadType.Excel)}>
                        Excel
                    </Button>
                    <Button danger onClick={() => downloadReport(DownloadType.Csv)}>
                        CSV
                    </Button>
                    <Button danger onClick={() => downloadReport(DownloadType.Pdf)}>
                        PDF
                    </Button>
                </Flex>
                <Flex className="flex-col justify-end gap-3 px-0 md:flex-row">
                    <Select
                        options={corporateList}
                        placeholder="Select Corporate"
                        showSearch
                        loading={CorporateListLoading}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleChangeCorporate}
                        allowClear
                        className="w-full md:w-auto min-w-52"
                    />
                    {xs ? (
                        <Flex className="w-full sm:w-fit" justify="space-between" align="center">
                            <DatePicker
                                onChange={handleFromChange}
                                format={dateFormat}
                                defaultValue={dayjs(filters.from, dateFormat)}
                            />
                            <SwapRightOutlined />
                            <DatePicker
                                onChange={handleToChange}
                                format={dateFormat}
                                defaultValue={dayjs(filters.to, dateFormat)}
                            />
                        </Flex>
                    ) : (
                        <DatePicker.RangePicker
                            onChange={handleDateChange}
                            format={dateFormat}
                            defaultValue={[
                                dayjs(filters.from, dateFormat),
                                dayjs(filters.to, dateFormat),
                            ]}
                            disabledDate={disabledDate}
                            className="w-full md:w-auto"
                        />
                    )}
                </Flex>
            </Row>
            <GenericTable
                rowKey={record => record.id}
                bordered={false}
                columns={walletReportcolumns}
                dataSource={data}
                onChange={handleTableChange}
                // scroll={{ x: 992 }}
                loading={isLoading}
                pagination={false}
                className="w-full mt-8"
            />
            <Pagination
                current={filters.page}
                onChange={handlePageChange}
                size="default"
                className="text-end pt-7"
                total={count}
                showSizeChanger={false}
            />
        </>
    );
};

export default WalletReport;
