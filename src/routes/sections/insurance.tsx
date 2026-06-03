import { lazy } from 'react';

import { paths } from '../paths';

const Home = lazy(() => import('@src/domains/dashboard/insurance/pages/Home'));
const Orders = lazy(() => import('@src/domains/dashboard/insurance/pages/Orders'));
const Insurance = lazy(() => import('@src/domains/dashboard/insurance/pages/Insurance'));

// -----------------------------------------------------------------------

export const insuranceRoutes = [
    { element: <Home />, index: true },
    { element: <Orders />, path: paths.insurance.orders },
    { element: <Insurance />, path: paths.insurance.insurance },
];
