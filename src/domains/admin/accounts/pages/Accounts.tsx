import React from 'react';

import { Tabs, TabsProps } from 'antd';

import ServiceUnavailable from '@src/domains/failed/pages/ServiceUnavailable';
import { checkServiceAccess } from '@utils/checkAccess';

import BulkRefund from '../components/BulkRefund';
import CreateTransactions from '../components/CreateTransactions';
import SelfTransfer from '../components/SelfTransfer';
import TransferFunds from '../components/TransferFunds';
import WalletReport from '../components/WalletReport';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Self Transfer',
        children: <SelfTransfer />,
    },
    {
        key: '2',
        label: 'Transfer Funds',
        children: <TransferFunds />,
    },
    {
        key: '3',
        label: 'Create Transaction',
        children: <CreateTransactions />,
    },
    {
        key: '4',
        label: 'Bulk Refund',
        children: <BulkRefund />,
    },
    {
        key: '5',
        label: 'Wallet Reports',
        children: <WalletReport />,
    },
];
const Accounts = () => {
    const filteredItems = items.filter(item => {
        const serviceName = item.label;
        return checkServiceAccess('Accounts', serviceName as string);
    });
    if (filteredItems.length === 0) return <ServiceUnavailable />;
    return <Tabs defaultActiveKey="1" items={filteredItems} />;
};

export default Accounts;
