import { Tabs, TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

// import AccessCode from '../component/accessCode/AccessCode';
import AccessCode from '../component/accessCode/AccessCode';
import Banners from '../component/banners/Banners';
import Cashback from '../component/cashback/Cashback';
import Categories from '../component/categories/Categories';
import CouponCode from '../component/couponCode/CouponCode';
import DisabledService from '../component/disableService/DisabledService';
import Templates from '../component/emailTemplates/Templates';
import PackagePage from '../component/package/Package';
import Roles from '../component/partnerPermission/Roles';
import RefferalCode from '../component/refferalCode/RefferalCode';
import ServiceOperatorPage from '../component/serviceOperator/ServiceOperators';
import SubscriptionCodes from '../component/subscriptionCodes/SubscriptionCodes';
import VendorPage from '../component/vendor/Vendors';
import WhatsAppNumbers from '../component/whatsappNumber/WhatsAppNumbers';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Vendors',
        children: <VendorPage />,
    },
    {
        key: '2',
        label: 'Service Operators',
        children: <ServiceOperatorPage />,
    },
    {
        key: '3',
        label: 'Packages',
        children: <PackagePage />,
    },
    {
        key: '4',
        label: 'Cashback',
        children: <Cashback />,
    },
    {
        key: '51',
        label: 'Subscription Codes',
        children: <SubscriptionCodes />,
    },
    {
        key: '5',
        label: 'Disable Service',
        children: <DisabledService />,
    },
    {
        key: '6',
        label: 'Banners',
        children: <Banners />,
    },

    {
        key: '7',
        label: 'Categories',
        children: <Categories />,
    },
    {
        key: '8',
        label: 'Referral Code',
        children: <RefferalCode />,
    },
    {
        key: '9',
        label: 'Invoice Templates',
        children: <Templates />,
    },
    {
        key: '10',
        label: 'Access Code',
        children: <AccessCode />,
    },
    {
        key: '11',
        label: 'Partner Permissions',
        children: <Roles />,
    },
    {
        key: '12',
        label: 'Coupon Code',
        children: <CouponCode />,
    },
    {
        key: '13',
        label: 'Peko WhatsApp Numbers',
        children: <WhatsAppNumbers />,
    },
];

const Settings = () => {
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Settings', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default Settings;
