import React from 'react';

import { Tabs, TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import CorporateUser from '../components/CorporateUser';
// import Partner from '../components/Partner';
import Roles from '../components/Roles';
import SystemUser from '../components/SystemUser';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Corporate Users',
        children: <CorporateUser />,
    },
    {
        key: '2',
        label: 'System Users',
        children: <SystemUser />,
    },
    {
        key: '3',
        label: 'Roles',
        children: <Roles />,
    },
    // {
    //     key: '4',
    //     label: 'Partner',
    //     children: <Partner />,
    // },
];

const Users = () => {
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Users', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default Users;
