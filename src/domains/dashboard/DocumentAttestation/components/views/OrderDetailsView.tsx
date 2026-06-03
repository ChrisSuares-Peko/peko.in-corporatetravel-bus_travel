import React from 'react';

import { Flex, Grid } from 'antd';
import { useParams } from 'react-router-dom';

import useGetOrderDetails from '../../hooks/useGetOrderDetails';
import AgentsContact from '../sections/AgentsContact';
import Orders from '../sections/Orders';
import OrdersMobileView from '../sections/OrdersMobileView';
import OrderStatus from '../sections/OrderStatus';

const OrderDetailsView = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const params = useParams();
    const { ordersList, status, isLoading } = useGetOrderDetails(Number(params?.id));

    return (
        <Flex vertical gap={25}>
            {screens.md ? (
                <Orders Loading={isLoading} details={ordersList ?? []} />
            ) : (
                <OrdersMobileView details={ordersList ?? []} />
            )}
            <OrderStatus status={status} />
            <AgentsContact />
        </Flex>
    );
};

export default OrderDetailsView;
