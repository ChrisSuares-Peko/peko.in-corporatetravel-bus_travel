import { useEffect, useState } from 'react';

import { Tabs, TabsProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import useScreenSize from '@src/hooks/useScreenSize';
import { checkServiceAccess } from '@utils/checkAccess';

import CollectorKyb from '../component/collectorKyb/CollectorKyb';
import ConnectPage from '../component/connect/Table';
import Edoc from '../component/edoc/Edoc';
import EmailDomain from '../component/emailDomain/EmailDomain';
import EmailDomainPlans from '../component/emailDomainPlans/EmailDomainPlans';
import Plans from '../component/eSIM/Table';
import ESR from '../component/esr/ESR';
import GiftCardsPage from '../component/giftCards/Table';
import Hike from '../component/hike/Hike';
import OfficeAddressPlans from '../component/officeAddress/Plan';
import Works from '../component/pekoWorks/Works';
import SubscriptionPlansPage from '../component/subscriptionPlans/Table';
import SubscriptionPage from '../component/subscriptions/Table';
import CorporateTax from '../component/taxRegistration/CorporateTax';
import VendorPayout from '../component/vendorPayout/vendorPayout';
import WorkPlan from '../component/workPlan/WorkPlan';
import WorkspacePage from '../component/workspace/Table';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Software Products',
        children: <SubscriptionPage />,
    },
    {
        key: '2',
        label: 'Software Plans',
        children: <SubscriptionPlansPage />,
    },
    {
        key: '3',
        label: 'Office Address',
        children: <OfficeAddressPlans />,
    },
    {
        key: '4',
        label: 'Workspaces',
        children: <WorkspacePage />,
    },
    {
        key: '5',
        label: 'Corporate Tax Registration',
        children: <CorporateTax />,
    },
    {
        key: '6',
        label: 'Peko Works',
        children: <Works />,
    },
    {
        key: '7',
        label: 'Work Plans',
        children: <WorkPlan />,
    },
    {
        key: '8',
        label: 'Gift Cards',
        children: <GiftCardsPage />,
    },
    {
        key: '9',
        label: 'Peko Connect',
        children: <ConnectPage />,
    },
    {
        key: '10',
        label: 'E-Docs',
        children: <Edoc />,
    },
    {
        key: '11',
        label: 'Vendor Payout',
        children: <VendorPayout />,
    },
    {
        key: '12',
        label: 'ESR',
        children: <ESR />,
    },
    {
        key: '13',
        label: 'Hike',
        children: <Hike />,
    },
    {
        key: '14',
        label: 'eSIM Plans',
        children: <Plans />,
    },
    {
        key: '15',
        label: 'Email/Domain',
        children: <EmailDomain />,
    },
    {
        key: '16',
        label: 'Email/Domain Plans',
        children: <EmailDomainPlans />,
    },
    {
        key: '17',
        label: 'Collector KYB',
        children: <CollectorKyb />,
    },
];

const Manage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { xs } = useScreenSize();
    const stateData = location.state;
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Manage', serviceName as string);
    });
    const [activeKey, setActiveKey] = useState(stateData?.activeKey || '1');
    useEffect(() => {
        if (stateData) {
            setActiveKey(stateData.activeKey || '1');
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, navigate, stateData]);
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return (
        <Tabs size={xs ? 'small' : 'middle'} defaultActiveKey={activeKey} items={filteredItems} />
    );
};

export default Manage;
