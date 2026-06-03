import React from 'react';

import { Col, Empty, Flex, Pagination, Row, Skeleton, Typography } from 'antd';

import MoreTransactions from '@assets/svg/moretransactions.svg';

import TableMobile from './TableMobile';
import { tableData } from '../../types/dashboard';

type Props = {
    data: tableData[];
    page: number;
    handlePageChange: (page: number, pageSize: number) => void;
    count: number | undefined;
    isLoading: boolean;
};

const MobileTable = ({ data, count, page, handlePageChange, isLoading }: Props) => (
    <>
        <Row align="middle" className="p-5  rounded-md bg-bgLightGray">
            <Col xs={8}>
                <Flex justify="start">
                    <Typography.Text>Date</Typography.Text>
                </Flex>
            </Col>
            <Col xs={6}>
                <Flex justify="center">
                    <Typography.Text>Amount</Typography.Text>
                </Flex>
            </Col>
            <Col xs={6}>
                <Flex justify="center">
                    <Typography.Text>Status</Typography.Text>
                </Flex>
            </Col>
            <Col xs={4}>
                <Flex justify="center">
                    <Typography.Text>Action</Typography.Text>
                </Flex>
            </Col>
        </Row>
        {isLoading ? (
            <Skeleton paragraph={{ rows: 6 }} className="mt-5" />
        ) : (
            <Flex vertical className="h-full">
                {data.length > 0 ? (
                    data.map(transaction => (
                        <TableMobile key={transaction.transactionId} transaction={transaction} />
                    ))
                ) : (
                    <Flex vertical justify="center" align="center" className="h-full">
                        <Empty description="No data found" image={MoreTransactions} />
                    </Flex>
                )}
                <Pagination
                    current={page}
                    onChange={handlePageChange}
                    className="text-center"
                    size="small"
                    total={count}
                    showSizeChanger={false}
                />
            </Flex>
        )}
    </>
);

export default MobileTable;
