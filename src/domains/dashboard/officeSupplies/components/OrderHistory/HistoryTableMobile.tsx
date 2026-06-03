import React, { useState } from 'react';

import { RightOutlined, SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Divider, Flex, Input, Pagination, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';

const { officeSupplies } = paths;
interface HistoryTableMobileProps {
    searchText?: string | null;
}

const HistoryTableMobile = () => {
    const [searchText, setSearchText] = React.useState<string>('');
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const disabledDate = (current: any) => current && current > moment().startOf('day');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const dateFormat = 'YYYY-MM-DD';
    const [fromDate, setFromDate] = useState<string>(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    );
    const [toDate, setToDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const handleFromChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setFromDate(date.format(dateFormat));
        }
    };

    const handleToChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setToDate(date.format(dateFormat));
        }
    };
    const { orders, isLoading, count } = useOrderHistoryApi({
        from: fromDate,
        to: toDate,
        itemsPerPage: pageSize,
        page: currentPage,
        searchText,
        sort: 'DESC',
    });

    return (
        <>
            <Flex vertical className="my-1">
                <Typography.Paragraph className="text-xl font-medium">
                    Order History
                </Typography.Paragraph>
                <Flex justify="space-between" className="mt-5">
                    <DatePicker
                        onChange={handleFromChange}
                        format={dateFormat}
                        defaultValue={dayjs(fromDate, dateFormat)}
                        disabledDate={disabledDate}
                    />
                    <SwapRightOutlined />
                    <DatePicker
                        onChange={handleToChange}
                        format={dateFormat}
                        defaultValue={dayjs(toDate, dateFormat)}
                        disabledDate={disabledDate}
                    />
                </Flex>

                <Input
                    placeholder="Search"
                    allowClear
                    suffix={<SearchOutlined />}
                    className="mt-5 w-full"
                    style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </Flex>

            {orders.map((item, index) => (
                <Card size="small" className="mt-4 h-44 bg-slate-50 border-none p-2" key={index}>
                    <Flex className="w-full" gap={5} vertical>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500">
                                AED {Number(item.amount).toFixed(2)}
                            </Typography.Text>
                            <Flex
                                className={`text-sm p-1 px-4 rounded-md font-medium border ${item.status.toLowerCase() === 'pending' ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'}`}
                            >
                                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                            </Flex>
                        </Flex>
                        <Divider />
                        <Flex justify="space-between" align="center">
                            <Flex gap={5} vertical>
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Order ID: {item.transactionId}
                                </Typography.Text>
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Ordered On: {formattedDateTime(new Date(item.date))}
                                </Typography.Text>
                                {!Array.isArray(item.products) || item.products.length < 1 ? (
                                    '-'
                                ) : (
                                    <Flex gap={5} vertical>
                                        <Typography.Text className="line-clamp-1 text-xs me-1">
                                            {item.products[0]?.productName}
                                        </Typography.Text>
                                    </Flex>
                                )}
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Quantity: {item?.products.length}
                                </Typography.Text>
                            </Flex>
                            <Button type="default" className="rounded-md bg-white">
                                <Link to={`${officeSupplies.orderDetails}/${item.id}`}>
                                    <RightOutlined />
                                </Link>
                            </Button>
                        </Flex>
                    </Flex>
                </Card>
            ))}

            <Pagination
                className="sm:text-end text-center mt-10"
                total={count}
                current={currentPage}
                defaultPageSize={pageSize}
                onChange={(page, pageSize2) => {
                    setCurrentPage(page);
                    setPageSize(pageSize2);
                }}
            />
        </>
    );
};

export default HistoryTableMobile;
