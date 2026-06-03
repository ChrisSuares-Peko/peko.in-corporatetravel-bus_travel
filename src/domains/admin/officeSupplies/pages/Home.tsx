import React, { useEffect, useState } from 'react';

import { Tabs, TabsProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import CancelAndRefunds from '../components/CancelAndRefunds';
import OrderContent from '../components/Orders';
import Product from '../components/product/Product';
import ReturnRequests from '../components/ReturnRequest';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Orders',
        children: <OrderContent />,
    },
    {
        key: '2',
        label: 'Cancel & Refunds',
        children: <CancelAndRefunds />,
    },
    {
        key: '3',
        label: 'Return Request',
        children: <ReturnRequests />,
    },
    {
        key: '4',
        label: 'Products',
        children: <Product />,
    },
];

const Orders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stateData = location.state;
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Office Supplies', serviceName as string);
    });
    const [activeKey, setActiveKey] = useState(stateData?.activeKey || '1');
    useEffect(() => {
        if (stateData) {
            setActiveKey(stateData.activeKey || '1');
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, navigate, stateData]);

    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey={activeKey} items={filteredItems} />;
};

export default Orders;
