import { lazy } from 'react';

import TaxHistory from '@src/domains/dashboard/accounting/pages/TaxHistory';
import TaxOrderDetails from '@src/domains/dashboard/accounting/pages/TaxOrderDetails';
import TaxRegisterReview from '@src/domains/dashboard/accounting/pages/TaxRegisterReview';

import { paths } from '../paths';

const Dashboard = lazy(() => import('@src/domains/dashboard/accounting/pages/Dashboard'));
const AccountsDashboard = lazy(
    () => import('@src/domains/dashboard/accounting/pages/AccountsDashboard')
);
const VATRegistration = lazy(
    () => import('@src/domains/dashboard/accounting/pages/VATRegistration')
);
const BusinessHealthCheck = lazy(
    () => import('@src/domains/dashboard/accounting/pages/BusinessHealthCheck')
);
const TaxRegistration = lazy(
    () => import('@src/domains/dashboard/accounting/pages/TaxRegistration')
);
const TaxSuccess = lazy(() => import('@src/domains/dashboard/accounting/pages/TaxSuccess'));
const VatSuccess = lazy(() => import('@src/domains/dashboard/accounting/pages/VatSuccess'));

// -----------------------------------------------------------------------

export const accountingRoutes = [
    { element: <Dashboard />, index: true },
    { element: <AccountsDashboard />, path: paths.accounting.accountsDashboard },
    { element: <VATRegistration />, path: paths.accounting.vatRegistration },
    { element: <BusinessHealthCheck />, path: paths.accounting.businessHealthCheck },
    { element: <TaxRegistration />, path: paths.accounting.taxRegistration },
    { element: <TaxSuccess />, path: paths.accounting.taxSuccess },
    { element: <VatSuccess />, path: paths.accounting.vatSuccess },
    {
        element: <TaxRegisterReview />,
        path: `${paths.accounting.taxRegistration}/${paths.accounting.TaxRegisterReview}`,
    },
    {
        element: <TaxHistory />,
        path: `${paths.accounting.taxRegistration}/${paths.accounting.TaxHistory}`,
    },
    {
        element: <TaxOrderDetails />,
        path: `${paths.accounting.taxRegistration}/${paths.accounting.TaxHistory}/${paths.accounting.TaxOrderDetails}`,
    },
];
