import { paths } from '@src/routes/paths';

import { BookIcon } from '../assets/icons';

export const dashboardCardsData = [
    {
        icon: BookIcon,
        text: 'Book Keeping',
        path: paths.accounting.accountsDashboard,
    },
    {
        icon: BookIcon,
        text: 'VAT Registration',
        path: paths.accounting.vatRegistration,
    },
    {
        icon: BookIcon,
        text: 'VAT Filing',
        path: '',
    },
    {
        icon: BookIcon,
        text: 'Corporate Tax',
        path: paths.accounting.taxRegistration,
    },
];

export const FirstPlanFeatures = [
    'Suitable for businesses with up to 50 monthly financial entries',
    'Services included:',
    'Monthly bookkeeping for up to 50 entries',
    'VAT calculation and filing',
    'Bank reconciliation',
    'Annual financial report',
    'Email and phone support',
];

export const OptionsArray = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
];

export const SecondPlanFeatures = [
    'Suitable for businesses with up to 100 monthly financial entries',
    'Services included:',
    'Monthly bookkeeping for up to 100 entries',
    'VAT calculation and filing',
    'Financial statement preparation',
    'General ledger maintenance',
    'Bank reconciliation',
    'Annual financial report',
    'Email and phone support',
];

export const ThirdPlanFeatures = [
    'Suitable for businesses with more than 100 monthly financial entries',
    'Services included:',
    'Unlimited monthly bookkeeping entries',
    'VAT calculation and filing',
    'Financial statement preparation',
    'General ledger maintenance',
    'Bank reconciliation',
    'Annual financial report',
    'Email and phone support',
    'Quarterly financial analysis and consultation',
];

export const taxHistory = [
    {
        date: '2024-04-12',
        plan: 'International Document Bullet Delivery',
        country: 'UAE',
        type: 'local',
        paymentMethod: 'WALLET',
        amount: 300,
    },
    {
        date: '2024-04-12',
        plan: 'International Document Bullet Delivery',
        country: 'UAE',
        type: 'local',
        paymentMethod: 'WALLET',
        amount: 300,
    },
    {
        date: '2024-04-12',
        plan: 'International Document Bullet Delivery',
        country: 'UAE',
        type: 'local',
        paymentMethod: 'WALLET',
        amount: 300,
    },
];
