import { lazy } from 'react';

import { paths } from '../paths';

const PaymentLink = lazy(() => import('@src/domains/dashboard/paymentLinks/pages/PaymentLink'));
const CreatePaymentLink = lazy(
    () => import('@src/domains/dashboard/paymentLinks/pages/CreatePaymentLink')
);

// -----------------------------------------------------------------------

export const paymentLinkRoutes = [
    { element: <PaymentLink />, index: true },
    { element: <CreatePaymentLink />, path: paths.paymentLinks.CreatePayment },
];
