import { lazy } from 'react';

import { paths } from '../paths';

const Payments = lazy(() => import('@src/domains/dashboard/payments/pages/Payment'));
const PaymentFailure = lazy(() => import('@src/domains/dashboard/payments/pages/PaymentFailure'));
const PaymentSuccess = lazy(() => import('@src/domains/dashboard/payments/pages/PaymentSuccess'));

export const paymentRoutes = [
    { element: <Payments />, index: true },
    { element: <PaymentSuccess />, path: paths.payments.paymentsuccess },
    { element: <PaymentFailure />, path: paths.payments.paymentFailure },
];
