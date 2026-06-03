import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Flex, Input, Pagination, DatePicker } from 'antd';
import dayjs from 'dayjs';

import useFilter from '../../hooks/useFilter';
import { useOrderHistoryTable } from '../../hooks/useOrderHistoryTable';
import { filterState } from '../../types/types';
import { OrderHistoryColumns } from '../../utils/data';

type OrderHistoryPageProps = {};

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const oneMonthBefore = today.subtract(1, 'month'); // Subtract 1 month
    const oneMonthBeforeFormatted = oneMonthBefore.format('YYYY-MM-DD');
    const initialValues = {
        search: '',
        start: 0,
        length: 10,
        draw: 1,
        from: oneMonthBeforeFormatted,
        to: todayFormatted,
    };
    const dateFormat = 'YYYY-MM-DD';
    const [filter, setFilter] = useState<filterState>(initialValues);
    const { handleSearch, handlePageChange, handleDateChange } = useFilter({
        setFilter,
        initalStartDate: initialValues.from,
        initalEndDate: initialValues.to,
    });

    const { data, isLoading, count } = useOrderHistoryTable(
        filter.draw,
        filter.start,
        filter.length,
        filter.search,
        filter.from,
        filter.to
    );

    return (
        <>
            <Flex justify="space-between" className="my-1">
                <Typography.Text className="xl:text-xl lg:text-lg  sm:text-lg text-lg font-medium ">
                    Order History
                </Typography.Text>
                <Flex>
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                        value={[dayjs(filter.from, dateFormat), dayjs(filter.to, dateFormat)]}
                        className="w-full sm:w-fit"
                        disabledDate={current => current && current > dayjs().endOf('day')}
                    />
                    <Flex align="center" style={{ marginLeft: '10px' }}>
                        <Input
                            placeholder="Search for orders"
                            suffix={<SearchOutlined />}
                            allowClear
                            type="text"
                            maxLength={100}
                            value={filter.search}
                            onChange={handleSearch}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Table
                columns={OrderHistoryColumns}
                dataSource={data.map(item => ({ ...item, key: item.transactionId }))}
                loading={isLoading}
                pagination={false}
            />
            <Pagination
                current={filter.start}
                onChange={handlePageChange}
                size="default"
                className="text-end pt-10"
                total={count}
            />
        </>
    );
};

export default OrderHistoryPage;
