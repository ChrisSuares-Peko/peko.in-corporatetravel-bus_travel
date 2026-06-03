import { lazy } from 'react';

import { airlineRoutes } from './airline';
import { esimRoutes } from './esim';
import { hotelsRoutes } from './hotels';
import { paths } from '../paths';

const CorporateTravel = lazy(
    () => import('@domains/dashboard/CorporateTravel/pages/CorporateTravel')
);

export const corporateTravelRoutes = [
    {
        element: <CorporateTravel />,
        path: paths.dashboard.corporateTravel,
    },
    {
        path: paths.airline.index,
        children: airlineRoutes,
    },
    {
        path: paths.hotels.index,
        children: hotelsRoutes,
    },
    {
        path: paths.esim.index,
        children: esimRoutes,
    },
];
