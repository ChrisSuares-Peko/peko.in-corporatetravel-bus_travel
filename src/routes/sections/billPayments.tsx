import { lazy } from 'react';

import { paths } from '@routes/paths';
import BulkUpload from '@src/domains/dashboard/billPayments/pages/postpaid/BulkUpload';

const BillPaymentsList = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/BillPaymentsList')
);
const DetailPage = lazy(() => import('@src/domains/dashboard/billPayments/pages/DetailPage'));
const BulkPaymentDetailPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/BulkPaymentDetailPage')
);
const BulkPayReviewPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/postpaid/BulkPayReview')
);

const DubaiPoliceDetailPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/dubai-police/DubaiPolice')
);
const DubaiPoliceTicket = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/dubai-police/DubaiPoliceTicketsList')
);
const DarbDetailPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/darb/DarbDetailPage')
);
const HafilatPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/hafilat/HafilatPage')
);
const SalikPage = lazy(() => import('@src/domains/dashboard/billPayments/pages/salik/SalikPage'));
const SalikDetailsPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/salik/SalikPage')
);
const HafilatDetailsPage = lazy(
    () => import('@src/domains/dashboard/billPayments/pages/hafilat/HafilatDetailsPage')
);

// -----------------------------------------------------------------------

export const billPaymentsRoutes = [
    { element: <BillPaymentsList />, index: true },

    { element: <DetailPage />, path: paths.billPayments.duPrepaid },
    { element: <DetailPage />, path: paths.billPayments.etisalatPrepaid },
    { element: <DetailPage />, path: paths.billPayments.NOL },
    { element: <DetailPage />, path: paths.billPayments.ajmanSewerage },
    { element: <DetailPage />, path: paths.billPayments.lootah },
    { element: <DetailPage />, path: paths.billPayments.darb },
    // { element: <DetailPage />, path: paths.billPayments.salik },
    { element: <BulkPaymentDetailPage />, path: paths.billPayments.AADC },
    {
        element: <BulkUpload />,
        path: `${paths.billPayments.AADC}/${paths.billPayments.bulkUpload}`,
    },
    {
        element: <BulkPayReviewPage />,
        path: `${paths.billPayments.AADC}/${paths.billPayments.bulkPayment}`,
    },
    { element: <BulkPaymentDetailPage />, path: paths.billPayments.duPostpaid },
    { element: <BulkPaymentDetailPage />, path: paths.billPayments.etisalatPostpaid },
    {
        element: <BulkUpload />,
        path: `${paths.billPayments.etisalatPostpaid}/${paths.billPayments.bulkUpload}`,
    },
    {
        element: <BulkUpload />,
        path: `${paths.billPayments.duPostpaid}/${paths.billPayments.bulkUpload}`,
    },
    {
        element: <BulkPayReviewPage />,
        path: `${paths.billPayments.etisalatPostpaid}/${paths.billPayments.bulkPayment}`,
    },
    {
        element: <BulkPayReviewPage />,
        path: `${paths.billPayments.duPostpaid}/${paths.billPayments.bulkPayment}`,
    },

    { element: <BulkPaymentDetailPage />, path: paths.billPayments.ADDC },
    {
        element: <BulkUpload />,
        path: `${paths.billPayments.ADDC}/${paths.billPayments.bulkUpload}`,
    },
    {
        element: <BulkPayReviewPage />,
        path: `${paths.billPayments.ADDC}/${paths.billPayments.bulkPayment}`,
    },
    { element: <BulkPaymentDetailPage />, path: paths.billPayments.EWE },
    {
        element: <BulkUpload />,
        path: `${paths.billPayments.EWE}/${paths.billPayments.bulkUpload}`,
    },
    {
        element: <BulkPayReviewPage />,
        path: `${paths.billPayments.EWE}/${paths.billPayments.bulkPayment}`,
    },

    { element: <DubaiPoliceDetailPage />, path: paths.billPayments.dubaiPolice },
    {
        element: <DubaiPoliceTicket />,
        path: `${paths.billPayments.dubaiPolice}/${paths.billPayments.dubaiPoliceTicket}`,
    },
    { element: <SalikPage />, path: paths.billPayments.salik },

    // { element: <DarbDetailPage />, path: paths.billPayments.darb },
    { element: <HafilatPage />, path: paths.billPayments.hafilat },
    {
        element: <HafilatDetailsPage />,
        path: `${paths.billPayments.hafilat}/${paths.billPayments.hafilatDetails}`,
    },
    // { element: <DetailPage />, path: paths.billPayments.sewa },
];
