import React from 'react';

import { Tabs, TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import PasswordPolicy from '../components/passwordPolicy/PasswordPolicy';
import PasswordProtection from '../components/passwordProtection/PasswordProtection';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Password Policy',
        children: <PasswordPolicy />,
    },
    {
        key: '2',
        label: 'Password Protection',
        children: <PasswordProtection />,
    },
    {
        key: '3',
        label: 'Application Policy',
        children: '',
    },
];
const SystemConfigration = () => {
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('System Configuration', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default SystemConfigration;
