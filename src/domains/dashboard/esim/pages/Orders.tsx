import React, { useState } from 'react';

import { Row, Col } from 'antd';

import useDebounce from '@src/hooks/useDebounce';

import OrderHeader from '../components/orders/OrderHeader';
import OrderTable from '../components/orders/OrderTable';
import useGetOrdersList from '../hooks/useGetOrdersList';

type Props = {};

const Orders = (props: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebounce(searchText, 300); // Use the custom hook
    const { data, totalRecord, isLoading } = useGetOrdersList(10, currentPage, debouncedSearchText);

    return (
        <Row>
            <Col span={24}>
                <OrderHeader setSearchText={setSearchText} />
            </Col>
            <Col className="mt-8" span={24}>
                <OrderTable
                    data={data}
                    setCurrentPage={setCurrentPage}
                    totalRecord={totalRecord}
                    isLoading={isLoading}
                />
            </Col>
        </Row>
    );
};

export default Orders;
