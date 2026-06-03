import { Tabs, TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import Airline from '../components/Airline';
import Attestation from '../components/Attestation/Attestation';
import ConnectionRequests from '../components/connectionRequest/ConnectionRequests';
import Corporate from '../components/corporate/Corporate';
import Esign from '../components/eSign/Table';
import Esim from '../components/esim/Orders';
import Insurance from '../components/Insurance/Insurance';
import Invoices from '../components/invoices/Invoices';
import Orders from '../components/orders/Orders';
import ReportScheduling from '../components/SchedulingReport/ReportScheduling';
import SoftwareOrders from '../components/softwareOrders/SoftwareOrders';
import SubscriptionsTable from '../components/subscriptions/SubscriptionsTable';
import Transactions from '../components/transactions/Transactions';
import Vendors from '../components/vendors/Vendors';
import OrderContent from '../components/Works/Orders';
import Workspace from '../components/workspace/Workspace';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Subscriptions',
        children: <SubscriptionsTable />,
    },
    {
        key: '2',
        label: 'Vendors',
        children: <Vendors />,
    },
    {
        key: '3',
        label: 'Corporate',
        children: <Corporate />,
    },
    {
        key: '4',
        label: 'Orders',
        children: <Orders />,
    },
    {
        key: '5',
        label: 'Software Orders',
        children: <SoftwareOrders />,
    },
    {
        key: '6',
        label: 'eSIM',
        children: <Esim />,
    },
    {
        key: '7',
        label: 'Peko Works',
        children: <OrderContent />,
    },
    {
        key: '8',
        label: 'Connection Requests',
        children: <ConnectionRequests />,
    },
    {
        key: '9',
        label: 'Workspace Orders',
        children: <Workspace />,
    },
    {
        key: '10',
        label: 'Invoices',
        children: <Invoices />,
    },
    // {
    //     key: '11',
    //     label: 'Visa Applications',
    //     children: <VisaApplications />,
    // },
    {
        key: '12',
        label: 'Attestations',
        children: <Attestation />,
    },
    {
        key: '13',
        label: 'Transactions',
        children: <Transactions />,
    },
    {
        key: '14',
        label: 'eSign',
        children: <Esign />,
    },
    {
        key: '15',
        label: 'Airline Cancellation',
        children: <Airline />,
    },
    {
        key: '16',
        label: 'Scheduling Reports',
        children: <ReportScheduling />,
    },
    {
        key: '17',
        label: 'Insurance',
        children: <Insurance />,
    },
];

const Reports = () => {
    const filteredItems: any = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Reports', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default Reports;
