import { lazy } from 'react';

import { paths } from '../paths';

const LogisticsHome = lazy(() => import('@src/domains/dashboard/logistics/pages/LogisticsHome'));
const ShipmentDetailsPage = lazy(
    () => import('@src/domains/dashboard/logistics/pages/ShipmentDetails')
);
const PaymentPage = lazy(() => import('@src/domains/dashboard/logistics/pages/Payment'));
const PaymentStatusPage = lazy(
    () => import('@src/domains/dashboard/logistics/pages/PaymentStatus')
);
const TrackShipmentPage = lazy(
    () => import('@src/domains/dashboard/logistics/pages/TrackShipment')
);
const OrderHistoryPage = lazy(() => import('@src/domains/dashboard/logistics/pages/OrderHistory'));

export const logisticsRoutes = [
    { element: <LogisticsHome />, index: true },
    { element: <ShipmentDetailsPage />, path: paths.logistics.details },
    { element: <PaymentPage />, path: paths.logistics.payment },
    { element: <PaymentStatusPage />, path: paths.logistics.paymentStatus },
    {
        element: <TrackShipmentPage />,
        path: `${paths.logistics.orderHistory}/${paths.logistics.track}`,
    },
    {
        element: <TrackShipmentPage />,
        path: `${paths.logistics.track}`,
    },
    { element: <OrderHistoryPage />, path: paths.logistics.orderHistory },
];
