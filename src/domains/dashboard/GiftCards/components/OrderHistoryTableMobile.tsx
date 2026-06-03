import { FC, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Input, Pagination, Row, Typography, Empty, Skeleton } from 'antd';

import useFilter from '@src/domains/dashboard/GiftCards/hooks/useFilter';

import OrderHistorycardMobile from './OrderHistorycardMobile';
import { useOrderHistoryTable } from '../hooks/useOrderHistoryTable';
import { filterState } from '../types/types';

interface HistoryTableMobileProps {
    searchText?: string | null;
}

const OrderHistoryTableMobile: FC<HistoryTableMobileProps> = ({ searchText }) => {
    const [filter, setFilter] = useState<filterState>({
        search: '',
        start: 0,
        length: 10,
        draw: 1,
    });
    const { handleSearch, handlePageChange } = useFilter({ setFilter });
    const { data, isLoading, count } = useOrderHistoryTable(
        filter.draw,
        filter.start,
        filter.length,
        filter.search
    );

    const renderSkeleton = () => <Skeleton active paragraph={{ rows: 3 }} />;
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];

    let tableContent;
    if (isLoading) {
        tableContent = Array.from({ length: 10 }).map((_, index) => (
            <Card size="small" className="h-40 p-2 mt-4 border-none bg-slate-50" key={index}>
                <Flex className="w-full" gap={5} vertical>
                    {renderSkeleton()}
                </Flex>
            </Card>
        ));
    } else if (data.length === 0) {
        tableContent = <Empty description="No data available" />;
    } else {
        tableContent = data.map((item, index) => (
            <OrderHistorycardMobile key={index} item={item} /> // Use SubscriptionCard component
        ));
    }

    function formattedDateOnly(date: Date): string {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `${monthName} ${day}-${year} ${time}`;
    }

    return (
        <Flex vertical gap={20} className="">
            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                <Col xs={24} sm={12} md={6}>
                    <Typography.Text className="text-lg font-medium xl:text-xl lg:text-lg sm:text-lg">
                        Order History
                    </Typography.Text>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Search"
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={100}
                        value={filter.search}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>
            {tableContent}
            <Pagination
                current={filter.start}
                onChange={handlePageChange}
                size="small"
                className="mt-10 text-center"
                total={count}
            />
        </Flex>
    );
};

export default OrderHistoryTableMobile;
