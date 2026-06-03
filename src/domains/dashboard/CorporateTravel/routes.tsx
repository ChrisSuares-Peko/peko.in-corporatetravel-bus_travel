import { lazy } from 'react';

const CorporateTravelPage = lazy(
    () => import('@domains/dashboard/CorporateTravel/pages/CorporateTravel')
);

export const corporateTravelRoutes = [{ element: <CorporateTravelPage />, index: true }];
