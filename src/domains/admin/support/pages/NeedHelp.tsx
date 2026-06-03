import { useState } from 'react';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import { Tickets } from '../components';

const NeedHelpAdmin = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>('1');
    const [shouldRefreshTickets, setShouldRefreshTickets] = useState(false);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Tickets',
            children: (
                <Tickets
                    shouldRefreshTickets={shouldRefreshTickets}
                    setShouldRefreshTickets={setShouldRefreshTickets}
                />
            ),
        },
    ];

    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Need Help', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default NeedHelpAdmin;
