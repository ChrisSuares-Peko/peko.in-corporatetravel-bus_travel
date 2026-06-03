import React, { useEffect, useState } from 'react';

import { Tabs, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import LeaveSummaryForm from '../components/HRSettings/LeaveSummaryForm';
import PayrollSettingsForm from '../components/HRSettings/PayrollSettingsForm';
import SubscriptionSettings from '../components/HRSettings/SubscriptionSettings';

const HrSettings = () => {
    const location = useLocation();
    const [activeTabKey, setActiveTabKey] = useState('0');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const activeTab = queryParams.get('activeTab');

        if (activeTab) {
            setActiveTabKey(activeTab);
        }
    }, [location]);

    const onChange = (key: string) => {
        setActiveTabKey(key);
    };
    const items = [
        {
            key: '1',
            label: 'Payroll Settings',
            children: <PayrollSettingsForm setActiveTabKey={setActiveTabKey} />,
        },
        {
            key: '2',
            label: 'Leave Settings',
            children: <LeaveSummaryForm />,
        },
        // commented out for future use
        // {
        //     key: '3',
        //     label: 'WPS',
        //     children: <WpsSettingsForm />,
        //     disabled: true,
        // },
        // {
        //     key: '4',
        //     label: 'Reimbursement ',
        //     children: <LeaveSummaryForm />,
        //     disabled: true,
        // },
        // {
        //     key: '5',
        //     label: 'Billings',
        //     children: <LeaveSummaryForm />,
        //     disabled: true,
        // },
        {
            key: '6',
            label: 'Subscriptions Settings',
            children: <SubscriptionSettings />,
        },
    ];

    return (
        <>
            <Typography.Text className=" font-normal text-lg sm:text-2xl">Settings</Typography.Text>
            <Tabs className="mt-6" activeKey={activeTabKey} items={items} onChange={onChange} />
        </>
    );
};

export default HrSettings;
