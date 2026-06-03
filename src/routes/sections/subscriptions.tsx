import { lazy } from 'react';

import { paths } from '@routes/paths';
import SubscriptionCompanyDetails from '@src/domains/dashboard/Subscriptions/pages/SubscriptionCompanyDetails';

const SubscriptionsListingPage = lazy(
    () => import('@src/domains/dashboard/Subscriptions/pages/SubscriptionsListing')
);
const SubscriptionsDetailedView = lazy(
    () => import('@src/domains/dashboard/Subscriptions/pages/SubscriptionsDetailedView')
);

const SubscriptionOrderHistory = lazy(
    () => import('@src/domains/dashboard/Subscriptions/pages/SubscriptionOrderHistory')
);

// -----------------------------------------------------------------------

export const subscriptionRoutes = [
    { element: <SubscriptionsListingPage />, index: true },
    {
        element: <SubscriptionsDetailedView />,
        path: `${paths.subscriptions.details}${paths.subscriptions.id}`,
    },
    {
        element: <SubscriptionCompanyDetails />,
        path: `${paths.subscriptions.details}${paths.subscriptions.id}/${paths.subscriptions.companyDetails}${paths.subscriptions.id}`,
    },

    { element: <SubscriptionOrderHistory />, path: paths.subscriptions.orderHistory },
];
