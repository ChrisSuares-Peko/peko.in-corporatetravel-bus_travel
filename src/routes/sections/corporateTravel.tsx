import { lazy } from 'react';

import { airlineRoutes } from './airline';
import { busTicketRoutes } from './busTicket';
import { esimRoutes } from './esim';
import { hotelsRoutes } from './hotels';
import { paths } from '../paths';

const CorporateTravel = lazy(
    () => import('@domains/dashboard/CorporateTravel/pages/CorporateTravel')
);
const VisaSearch = lazy(
    () => import('@domains/dashboard/CorporateTravel/pages/VisaSearch')
);
// Layout wrapper that shows the service tab selector on all Bus Ticket sub-pages
const BusTicketLayout = lazy(
    () => import('@domains/dashboard/CorporateTravel/BusTicket/pages/BusTicketLayout')
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
    {
        element: <VisaSearch />,
        path: paths.visa.index,
    },
    {
        // BusTicketLayout renders the tab selector above every Bus Ticket page
        element: <BusTicketLayout />,
        path: paths.busTicket.index,
        children: busTicketRoutes,
    },
];
