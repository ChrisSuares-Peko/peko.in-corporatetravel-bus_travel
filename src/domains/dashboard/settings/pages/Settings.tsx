import { useEffect, useState } from 'react';

import { Flex, Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { useLocation } from 'react-router-dom';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkSubServiceAccessCorporate } from '@utils/checkAccess';

import BillingAndSavedCards from '../components/BillingAndSavedCards';
import Security from '../components/security/Security';
import SubscriptionPlans from '../components/SubscriptionPlans';
import UserManagement from '../components/UserManagement';

const Settings: React.FC = () => {
    const location = useLocation();
    const { activeTab } = location.state || {};

    const [activeTabKey, setActiveTabKey] = useState<string>(activeTab || '1');
    const [forceRemountKey, setForceRemountKey] = useState<number>(0);
    const handleTabChange = (key: string) => {
        if (key === '2') {
            setForceRemountKey(prevKey => prevKey + 1);
        }
        setActiveTabKey(key);
    };

    useEffect(() => {}, [activeTabKey]);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'User Management',
            children: <UserManagement key="userManagement" />,
        },
        {
            key: '2',
            label: 'Billings & Saved Cards',
            children: <BillingAndSavedCards key={`BillingAndSavedCards-${forceRemountKey}`} />,
        },
        {
            key: '3',
            label: 'Subscription Plans',
            children: <SubscriptionPlans key="Subscription Plans-3" />,
        },
        {
            key: '4',
            label: 'Referrals',
            children: <SubscriptionPlans key="Referrals-4" />,
        },
        {
            key: '5',
            label: 'Integrations',
            children: <SubscriptionPlans key="Integrations-5" />,
        },
        {
            key: '6',
            label: 'Security',
            children: <Security key="Security-6" />,
        },
    ];
    const filteredItems = items.filter(item =>
        checkSubServiceAccessCorporate('Settings', item.label as string)
    );

    useEffect(() => {
        if (filteredItems.length > 0 && !filteredItems.some(item => item.key === activeTabKey)) {
            handleTabChange(filteredItems[0].key);
        }
    }, [filteredItems, activeTabKey]);

    if (filteredItems.length === 0) return <ServiceUnavailable />;

    return (
        <Flex vertical gap={20}>
            <Typography.Text className="text-lg font-medium sm:text-xl">Settings</Typography.Text>
            <Tabs
                activeKey={activeTabKey}
                defaultActiveKey="1"
                items={filteredItems}
                onChange={handleTabChange}
            />
        </Flex>
    );
};

export default Settings;
