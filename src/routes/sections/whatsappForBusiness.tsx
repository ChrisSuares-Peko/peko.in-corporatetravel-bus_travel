import { lazy } from 'react';

import OrderHistoryPage from '@src/domains/dashboard/WhatsappForBusiness/components/orderHistory/OrderHistory';
import PaymentSuccess from '@src/domains/dashboard/WhatsappForBusiness/pages/PaymentSuccsessPage';
import ProjectTable from '@src/domains/dashboard/WhatsappForBusiness/pages/ProjectTable';

import { paths } from '../paths';

const WhatsappForBusiness = lazy(
    () => import('@src/domains/dashboard/WhatsappForBusiness/pages/Dashboard')
);

export const WhatsappForBusinessRoutes = [
    { element: <WhatsappForBusiness />, index: true },
    { element: <ProjectTable />, path: paths.whatsappForBusiness.MyProjects },
    { element: <OrderHistoryPage />, path: paths.whatsappForBusiness.orderhistory },
    { element: <PaymentSuccess />, path: paths.plans.paymentsuccess },
];
