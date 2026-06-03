import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Col, Empty, Flex, Input, Pagination, Row, Skeleton, Typography } from 'antd';

import MoreTransactions from '@assets/svg/moretransactions.svg';

import TableMobile from './TableMobile';
import { useOrderHistoryApi } from '../../hooks/useOrderHistoryApi';

const MobileTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTextInput, setSearchTextInput] = React.useState('');

    const { orders, isLoading, count } = useOrderHistoryApi({
        itemsPerPage: pageSize,
        page: currentPage,
        sort: 'DESC',
        search: searchTextInput,
    });

    return (
        <>
            <Flex wrap="wrap" justify="space-between" className="gap-5 mb-4">
                <Typography.Paragraph className="text-lg font-medium text-nowrap">
                    Order History
                </Typography.Paragraph>
                <Flex align="center">
                    <Input
                        suffix={<SearchOutlined />}
                        allowClear
                        placeholder="Search"
                        value={searchTextInput}
                        onChange={e => setSearchTextInput(e.target.value)}
                    />
                </Flex>
            </Flex>
            <Row align="middle" className="px-3 py-5 rounded-md bg-bgLightGray">
                <Col xs={7}>
                    <Flex justify="start">
                        <Typography.Text>Date</Typography.Text>
                    </Flex>
                </Col>
                <Col xs={9}>
                    <Flex justify="start">
                        <Typography.Text>Plan</Typography.Text>
                    </Flex>
                </Col>
                <Col xs={7}>
                    <Flex justify="start">
                        <Typography.Text>Status</Typography.Text>
                    </Flex>
                </Col>
            </Row>
            {isLoading ? (
                <Skeleton paragraph={{ rows: 6 }} className="mt-5" />
            ) : (
                <Flex vertical className="h-full">
                    {orders.length > 0 ? (
                        orders.map(transaction => <TableMobile transaction={transaction} />)
                    ) : (
                        <Flex vertical justify="center" align="center" className="h-full">
                            <Empty image={MoreTransactions} description="No data found" />
                        </Flex>
                    )}
                </Flex>
            )}
            <Pagination
                current={currentPage}
                className="mt-10 text-center"
                size="small"
                total={count}
                showSizeChanger={false}
                onChange={(page, pageSize2) => {
                    setCurrentPage(page);
                    setPageSize(pageSize2);
                }}
            />
        </>
    );
};

export default MobileTable;
