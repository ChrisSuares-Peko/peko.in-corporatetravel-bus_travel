import { lazy } from 'react';

import { paths } from '../paths';

const Customer = lazy(() => import('@domains/dashboard/Invoice/pages/Customers'));
const Dashboard = lazy(() => import('@domains/dashboard/Invoice/pages/Dashboard'));
const Invoice = lazy(() => import('@domains/dashboard/Invoice/pages/Invoice'));
const InvoiceDetails = lazy(() => import('@src/domains/dashboard/Invoice/pages/InvoicePreview'));
const InvoiceHistory = lazy(
    () => import('@src/domains/dashboard/Invoice/components/InvoiceHistory')
);
const Upload = lazy(() => import('@src/domains/dashboard/Invoice/pages/Upload'));
const KYB = lazy(() => import('@src/domains/dashboard/Invoice/pages/kyb/KybPage'));
const KybDocumentPage = lazy(
    () => import('@src/domains/dashboard/Invoice/pages/kyb/KybDocumentPage')
);
const KybSuccessPage = lazy(
    () => import('@src/domains/dashboard/Invoice/pages/kyb/KybSubmitSuccess')
);
const Guidelines = lazy(() => import('@domains/dashboard/Invoice/pages/GuideLines'));
const TrackDetails = lazy(() => import('@domains/dashboard/Invoice/pages/TrackInvoice'));
const SuccessPage = lazy(() => import('@domains/dashboard/Invoice/pages/PaymentSuccess'));
const PaymentLink = lazy(() => import('@domains/dashboard/Invoice/pages/paymentLinks/PaymentLink'));
const OrderHistoryTable = lazy(
    () => import('@src/domains/dashboard/Invoice/pages/paymentLinks/OrderHistory')
);

export const invoiceRoutes = [
    { element: <Dashboard />, index: true },
    { element: <KYB />, path: paths.invoice.kybPage },
    {
        element: <KybDocumentPage />,
        path: `${paths.invoice.kybPage}/${paths.invoice.kybDocumentPage}`,
    },
    {
        element: <KybSuccessPage />,
        path: paths.invoice.kybSuccess,
    },
    { element: <Invoice />, path: paths.invoice.create },
    { element: <Upload />, path: paths.invoice.upload },
    { element: <Customer />, path: paths.invoice.customers },
    { element: <PaymentLink />, path: paths.invoice.paymentLinks },
    {
        element: <OrderHistoryTable />,
        path: `${paths.invoice.paymentLinks}/${paths.invoice.orderHistory}`,
    },

    {
        element: <InvoiceDetails />,
        path: `${paths.invoice.create}/${paths.invoice.invoicedetails}`,
    },
    { element: <InvoiceHistory />, path: paths.invoice.invoicehistory },
    {
        element: <Guidelines />,
        path: `${paths.invoice.create}/${paths.invoice.invoicedetails}/${paths.invoice.guidelines}`,
    },
    {
        element: <TrackDetails />,
        path: `${paths.invoice.invoicehistory}/${paths.invoice.trackDetails}`,
    },
    {
        element: <SuccessPage />,
        path: `${paths.invoice.success}`,
    },
];
