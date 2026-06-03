import { lazy } from 'react';

import { paths } from '@routes/paths';

const GiftCardListingPage = lazy(() => import('@src/domains/dashboard/GiftCards/pages/Listing'));
const GiftCardDetails = lazy(() => import('@src/domains/dashboard/GiftCards/pages/Details'));
const GiftCardCheckout = lazy(() => import('@src/domains/dashboard/GiftCards/pages/CheckoutPage'));
const GiftCardOrderHistoryPage = lazy(
    () => import('@src/domains/dashboard/GiftCards/pages/GiftCardOrderHistory')
);

const GiftCardSuccessPage = lazy(
    () => import('@src/domains/dashboard/GiftCards/pages/SuccessPages')
);
const GiftCardFailurePage = lazy(
    () => import('@src/domains/dashboard/GiftCards/pages/FailurePage')
);

// -----------------------------------------------------------------------

export const giftCardsRoutes = [
    { element: <GiftCardListingPage />, index: true },
    {
        element: <GiftCardDetails />,
        path: `${paths.giftcards.details}${paths.giftcards.id}`,
    },
    {
        element: <GiftCardCheckout />,
        path: `${paths.giftcards.details}${paths.giftcards.id}/${paths.giftcards.checkout}`,
    },

    { element: <GiftCardSuccessPage />, path: 'success' },
    { element: <GiftCardFailurePage />, path: 'failure' },
    { element: <GiftCardOrderHistoryPage />, path: paths.giftcards.orderHistory },
];
