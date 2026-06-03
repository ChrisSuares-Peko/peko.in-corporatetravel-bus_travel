/* eslint-disable import/no-named-as-default */
import { lazy } from 'react';

import ESRDetailedViewForStages from '@src/domains/dashboard/esr/pages/ESRDetailedViewForStages';
import EsrDocumentSuccess from '@src/domains/dashboard/esr/pages/EsrDocumentSuccess';
import EsrStatusViews from '@src/domains/dashboard/esr/pages/EsrStatusViews';
import PaymentFailurePage from '@src/domains/dashboard/esr/pages/PaymentFailurePage';
import PaymentSuccessPage from '@src/domains/dashboard/esr/pages/PaymentSuccessPage';
import ESRRegistration from '@src/domains/dashboard/esr/pages/Stage1/ESRRegistration';
import ESRRegistrationstage1 from '@src/domains/dashboard/esr/pages/Stage1questionnaire/ESRRegistrationstage1';
import ESRRegistrationStage2 from '@src/domains/dashboard/esr/pages/Stage2/ESRegistration';
import PaymentForEsr from '@src/domains/dashboard/payments/pages/PaymentForEsr';

import { paths } from '../paths';

const LandingPage = lazy(() => import('@src/domains/dashboard/esr/pages/LandingPage'));
const OrderHistoryPage = lazy(() => import('@src/domains/dashboard/esr/pages/OrderHistory'));
const OrderHistoryDetails = lazy(
    () => import('@src/domains/dashboard/esr/pages/OrderHistoryDetails')
);
export const esrRoutes = [
    { element: <LandingPage />, index: true },
    { element: <ESRRegistration />, path: paths.esr.registrationAssessment },
    { element: <EsrStatusViews />, path: paths.esr.view },
    { element: <ESRDetailedViewForStages />, path: paths.esr.stageView },
    { element: <ESRRegistrationStage2 />, path: paths.esr.stage2 },
    { element: <ESRRegistrationstage1 />, path: paths.esr.stage1 },
    { element: <EsrDocumentSuccess />, path: paths.esr.stageSuccess },
    { element: <PaymentSuccessPage />, path: paths.esr.paymentSuccess },
    { element: <PaymentSuccessPage />, path: paths.esr.paymentSuccess },
    { element: <PaymentFailurePage />, path: paths.esr.paymentFailure },
    { element: <PaymentForEsr />, path: paths.esr.payment },
    { element: <OrderHistoryPage />, path: paths.esr.orderHistory },
    {
        element: <OrderHistoryDetails />,
        path: `${paths.esr.orderHistory}/${paths.esr.orderHistoryDetails}`,
    },
];
