import { lazy } from 'react';

import { paths } from '../paths';

const WorksPage = lazy(() => import('@domains/dashboard/works/pages/WorksList'));
const WorkDetail = lazy(() => import('@domains/dashboard/works/pages/WorkDetail'));
const WorkPurchased = lazy(() => import('@domains/dashboard/works/pages/WorkPurchased'));
const ReviewPage = lazy(() => import('@domains/dashboard/works/pages/ReviewPage'));
const OrderHistoryPage = lazy(() => import('@domains/dashboard/works/pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('@domains/dashboard/works/pages/OrderDetailsPage'));

export const workRoutes = [
    { element: <WorksPage />, index: true },
    { element: <WorkDetail />, path: `${paths.works.detail}/${paths.works.id}` },
    {
        element: <ReviewPage />,
        path: `${paths.works.detail}/${paths.works.id}/${paths.works.purchase}/${paths.works.planId}`,
    },
    { element: <OrderHistoryPage />, path: paths.works.orderHistory },
    {
        element: <OrderDetailsPage />,
        path: `${paths.works.orderHistory}/${paths.works.orderDetails}/${paths.works.id}`,
    },
    { element: <WorkPurchased />, path: paths.works.purchased },
];
