import { lazy } from 'react';

const HomePage = lazy(() => import('@src/domains/dashboard/Home/pages/Home'));

// -----------------------------------------------------------------------

export const homeRoutes = [
    { element: <HomePage />, index: true },
    // {
    //     element: <PlansIndex />,
    //     path: `${paths.home.plans}`,
    // },
    // { element: <ReviewOrder />, path: `${paths.home.plans}/${paths.plans.reviewOrder}` },
];
