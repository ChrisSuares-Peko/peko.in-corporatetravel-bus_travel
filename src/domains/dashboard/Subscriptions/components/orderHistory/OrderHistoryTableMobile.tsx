import { FC, useState } from 'react';

import { SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import {
    Card,
    Col,
    Flex,
    Input,
    Pagination,
    Row,
    Typography,
    Empty,
    Skeleton,
    DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

import OrderHistorycardMobile from './OrderHistorycardMobile';
import useFilter from '../../hooks/useFilter';
import { useOrderHistoryTable } from '../../hooks/useOrderHistoryTable';
import { filterState } from '../../types/types';

interface HistoryTableMobileProps {
    searchText?: string | null;
}

const OrderHistoryTableMobile: FC<HistoryTableMobileProps> = ({ searchText }) => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const oneMonthBefore = today.subtract(1, 'month');
    const oneMonthBeforeFormatted = oneMonthBefore.format('YYYY-MM-DD');

    const [filter, setFilter] = useState<filterState>({
        search: '',
        start: 0,
        length: 10,
        draw: 1,
        from: oneMonthBeforeFormatted,
        to: todayFormatted,
    });
    const { handleSearch, handlePageChange, handleFromChange, handleToChange } = useFilter({
        setFilter,
        initalStartDate: filter.from,
        initalEndDate: filter.to,
    });
    const { data, isLoading, count } = useOrderHistoryTable(
        filter.draw,
        filter.start,
        filter.length,
        filter.search,
        filter.from,
        filter.to
    );
    const dateFormat = 'YYYY-MM-DD';
    const disabledDate = (current: any) => current && current > moment().startOf('day');
    const renderSkeleton = () => <Skeleton active paragraph={{ rows: 3 }} />;

    let tableContent;
    if (isLoading) {
        tableContent = Array.from({ length: 10 }).map((_, index) => (
            <Card size="small" className="mt-4 h-40 bg-slate-50 border-none p-2" key={index}>
                <Flex className="w-full" gap={5} vertical>
                    {renderSkeleton()}
                </Flex>
            </Card>
        ));
    } else if (data.length === 0) {
        tableContent = <Empty description="No data available" />;
    } else {
        tableContent = data.map((item, index) => (
            <OrderHistorycardMobile key={index} item={item} />
        ));
    }

    return (
        <Flex vertical gap={20} className="">
            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                <Col xs={24} sm={12} md={6}>
                    <Typography.Text className="xl:text-xl lg:text-lg sm:text-lg text-lg font-medium">
                        Order History
                    </Typography.Text>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Search for orders"
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={100}
                        value={filter.search}
                        onChange={handleSearch}
                    />
                </Col>
                <DatePicker
                    onChange={handleFromChange}
                    format={dateFormat}
                    defaultValue={dayjs(filter.from, dateFormat)}
                    disabledDate={disabledDate}
                />
                <SwapRightOutlined />
                <DatePicker
                    onChange={handleToChange}
                    format={dateFormat}
                    defaultValue={dayjs(filter.to, dateFormat)}
                    disabledDate={disabledDate}
                />
            </Row>
            <Row align="middle" className="p-5 rounded-md bg-bgLightGray">
                <Col xs={7}>
                    <Flex justify="start">
                        <Typography.Text>Subscription</Typography.Text>
                    </Flex>
                </Col>
                <Col xs={7}>
                    <Flex justify="center">
                        <Typography.Text>Amount</Typography.Text>
                    </Flex>
                </Col>
                <Col xs={7}>
                    <Flex justify="center">
                        <Typography.Text>Status</Typography.Text>
                    </Flex>
                </Col>
            </Row>
            {tableContent}
            <Pagination
                current={filter.start}
                onChange={handlePageChange}
                size="small"
                className="text-center mt-10"
                total={count}
            />
        </Flex>
    );
};

export default OrderHistoryTableMobile;
