import { useState } from 'react';

import { SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Grid, Input, Row, Typography } from 'antd';
import dayjs from 'dayjs';

import { DownloadType } from '@customtypes/general';

import NotificationTable from '../components/NotificationTable';
import useFilter from '../hooks/useFilter';
import { useNotificationListingApi } from '../hooks/useNotificationListing';

const NotificationsListAdmin = () => {
    const today = new Date();
    const dateFormat = 'YYYY-MM-DD';
    const disabledDate = (current: any) => current && current > dayjs().endOf('day');
    const [openModal, setOpenModal] = useState(false);
    const initialFilters = {
        page: 1,
        itemsPerPage: 10,
        filter: '',
        search: '',
        from: today.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
        sort: 'DESC',
        sortField: '',
    };
    const [filters, setFilters] = useState(initialFilters);
    const {
        handleSearch,
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleTableChange,
    } = useFilter({
        setFilters,
        initalStartDate: filters.from,
        initalEndDate: filters.to,
    });
    const { data, isLoading, count, handleRefresh, downloadReport } =
        useNotificationListingApi(filters);
    const screens = Grid.useBreakpoint();

    return (
        <Flex vertical gap={4} className="flex flex-col gap-4 md:gap-10">
            <Typography.Text className="w-full pb-6 text-base font-medium md:w-fit sm:text-lg lg:text-xl">
                Notifications
            </Typography.Text>
            <Col className="items-center justify-between w-full gap-4 pb-4 md:gap-0">
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
                    <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                        <Button
                            name="add"
                            type="primary"
                            className="w-full sm:w-fit"
                            danger
                            onClick={() => setOpenModal(true)}
                        >
                            Add Notification
                        </Button>
                        {!screens.xs ? (
                            <DatePicker.RangePicker
                                onChange={handleDateChange}
                                className="w-full sm:w-fit"
                                defaultValue={[
                                    dayjs(filters.from, dateFormat),
                                    dayjs(filters.to, dateFormat),
                                ]}
                                disabledDate={disabledDate}
                            />
                        ) : (
                            <Flex
                                className="w-full sm:w-fit"
                                justify="space-between"
                                align="center"
                            >
                                <DatePicker
                                    disabledDate={disabledDate}
                                    onChange={handleFromChange}
                                    format={dateFormat}
                                    defaultValue={dayjs(filters.from, dateFormat)}
                                />
                                <SwapRightOutlined />
                                <DatePicker
                                    disabledDate={disabledDate}
                                    onChange={handleToChange}
                                    format={dateFormat}
                                    defaultValue={dayjs(filters.to, dateFormat)}
                                />
                            </Flex>
                        )}
                        <Input
                            className="w-full sm:w-fit"
                            value={filters.search}
                            placeholder="Search"
                            onChange={handleSearch}
                            allowClear
                            maxLength={25}
                            suffix={<SearchOutlined />}
                        />
                    </Flex>
                </Row>
            </Col>
            <NotificationTable
                setOpenModal={setOpenModal}
                openModal={openModal}
                data={data}
                isLoading={isLoading}
                count={count}
                current={filters.page}
                handlePageChange={handlePageChange}
                handleTableChange={handleTableChange}
                handleRefresh={handleRefresh}
            />
        </Flex>
    );
};

export default NotificationsListAdmin;
