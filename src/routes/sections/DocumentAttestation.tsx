import { lazy } from 'react';

import { paths } from '../paths';

const DocumentAttestation = lazy(
    () => import('@src/domains/dashboard/DocumentAttestation/pages/DocumentAttestation')
);
const OrderDetails = lazy(
    () => import('@src/domains/dashboard/DocumentAttestation/pages/OrderDetails')
);
const OrderHistory = lazy(
    () => import('@src/domains/dashboard/DocumentAttestation/pages/OrderHistory')
);
const DeliveryDetailsMobileView = lazy(
    () =>
        import(
            '@src/domains/dashboard/DocumentAttestation/components/sections/DeliveryDetailsMobileView'
        )
);
const BillSummary = lazy(
    () => import('@src/domains/dashboard/DocumentAttestation/components/sections/BillSummary')
);
const PaymentMethod = lazy(
    () => import('@src/domains/dashboard/DocumentAttestation/components/sections/PaymentMethod')
);

export const documentAttestationRoutes = [
    { element: <DocumentAttestation />, index: true },
    {
        path: paths.documentAttestation.orderhistory,
        children: [
            { index: true, element: <OrderHistory /> },
            { element: <OrderDetails />, path: `${paths.documentAttestation.orderdetails}/:id` },
        ],
    },
    { element: <DeliveryDetailsMobileView />, path: paths.documentAttestation.deliveryDetails },
];
