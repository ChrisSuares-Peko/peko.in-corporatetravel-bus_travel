import type { FC } from 'react';
import { useState } from 'react';

import { RightOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Pagination, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';

const { works } = paths;
interface HistoryTableMobileProps {
    searchText?: string | null;
}

const HistoryTableMobile: FC<HistoryTableMobileProps> = ({ searchText }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [toDate, setToDate] = useState<string>(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    );
    const { orders, isLoading, count } = useOrderHistoryApi({
        from: '2000-01-01',
        to: toDate,
        itemsPerPage: pageSize,
        page: currentPage,
        searchText,
        sort: 'DESC',
    });

    return (
        <>
            {orders.map((item, index) => (
                <Card size="small" className="mt-4 h-40 bg-slate-50 border-none p-2" key={index}>
                    <Flex className="w-full" gap={5} vertical>
                        <Flex className="w-full" justify="space-between" align="center">
                            <Typography.Text className="text-base font-medium text-gray-500">
                                AED {parseFloat(item?.amount).toFixed(2)}
                            </Typography.Text>
                            <Flex
                                className={`capitalize text-sm p-1 px-4 rounded-md font-medium border ${item.status.toLowerCase() === 'pending' ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'}`}
                            >
                                {item.status.toLowerCase()}
                            </Flex>
                        </Flex>
                        <Divider />
                        <Flex justify="space-between" align="center">
                            <Flex gap={5} vertical>
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Ordered On: {formattedDateTime(new Date(item.date))}
                                </Typography.Text>
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Plan Name: {item?.planName}
                                </Typography.Text>
                                <Typography.Text className="text-xs font-normal text-gray-500">
                                    Amount: {parseFloat(item?.amount).toFixed(2)}
                                </Typography.Text>
                            </Flex>
                            <Button type="default" className="rounded-md bg-white">
                                <Link to={`${works.orderDetails}/${item.id}`}>
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
