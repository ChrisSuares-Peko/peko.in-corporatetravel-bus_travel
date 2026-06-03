import { Suspense, lazy } from 'react';

import { Skeleton } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import DashboardLayout from '@layouts/DashboardLayout';
import AuthGuard from '@src/guard/AuthGuard';
import CorporateUserGuard from '@src/guard/CorporateUserGuard';
// import IdleGuard from '@src/guard/IdleGuard';

import { accountingRoutes } from './accounting';
import { billPaymentsRoutes } from './billPayments';
import { bussinessDocsRoutes } from './businessDocs';
import { carbonFootprintRoutes } from './carbonFootprint';
import { connectRoutes } from './connect';
import { corporateTravelRoutes } from './corporateTravel';
import { documentAttestationRoutes } from './DocumentAttestation';
import { eInvoicingRoutes } from './einvoicing';
import { emailDomainRoutes } from './emailDomain';
import { eSignRoutes } from './eSign';
import { esrRoutes } from './esr';
import { giftCardsRoutes } from './giftCards';
import { HikeRoutes } from './Hike';
import { homeRoutes } from './home';
import { insuranceRoutes } from './insurance';
import { invoiceRoutes } from './invoice';
import { licenseRenewalRoutes } from './licenseRenewal';
import { logisticsRoutes } from './logistics';
import { needHelpRoutes } from './needHelp';
import { officeAddressRoutes } from './officeAddress';
import { officeSuppliesRoutes } from './officeSupplies';
import { paymentLinkRoutes } from './paymentLinks';
import { paymentRoutes } from './paymentRoutes';
import { payrollRoutes } from './payroll';
import { pekoCloudRoutes } from './pekoCloud';
import { pekoClubRoutes } from './pekoClub';
import { pekoConnectRoutes } from './pekoConnect';
import { perksRoutes } from './perks';
import { settingsRoutes } from './settings';
import { subscriptionRoutes } from './subscriptions';
import { vendorPayoutsRoutes } from './vedorPayouts';
import { WhatsappForBusinessRoutes } from './whatsappForBusiness';
import { workRoutes } from './works';
import { paths } from '../paths';
// Lazy-loaded components
const CorporateCard = lazy(
    () => import('@src/domains/dashboard/CorporateCard/pages/CorporateCard')
);
const HomePage = lazy(() => import('@src/domains/dashboard/Home/pages/Home'));
const ProfilePage = lazy(() => import('@src/domains/dashboard/profile/pages/Profile'));
const MoreServices = lazy(() => import('@src/domains/dashboard/moreServices/pages/MoreServices'));
const Reports = lazy(() => import('@src/domains/dashboard/Reports/pages/Reports'));
const NotificationsPage = lazy(
    () => import('@src/domains/dashboard/notifications/pages/NotificationsList')
);
const ServiceNotFound = lazy(() => import('@src/domains/dashboard/503/pages/ServiceNotFound'));
const ServiceNotAvailable = lazy(() => import('@src/domains/failed/pages/ServiceNotAvailable'));

export const dashboardRoutes = [
    {
        path: '',
        element: (
            <AuthGuard>
                <CorporateUserGuard>
                    {/* <IdleGuard> */}
                    <DashboardLayout>
                        <ErrorBoundary fallback={<ServiceNotAvailable />}>
                            <Suspense fallback={<Skeleton />}>
                                <Outlet />
                            </Suspense>
                        </ErrorBoundary>
                    </DashboardLayout>
                    {/* </IdleGuard> */}
                </CorporateUserGuard>
            </AuthGuard>
        ),
        children: [
            { path: paths.dashboard.home, children: homeRoutes },
            { element: <ProfilePage />, path: paths.dashboard.profile },
            { element: <Reports />, path: paths.dashboard.reports },
            { element: <MoreServices />, path: paths.dashboard.moreServices },
            { element: <HomePage />, path: paths.dashboard.tax },
            { element: <CorporateCard />, path: paths.dashboard.corporateCard },
            {
                path: paths.dashboard.subscriptions,
                children: subscriptionRoutes,
            },
            {
                path: paths.invoice.index,
                children: invoiceRoutes,
            },
            {
                path: paths.dashboard.corporateTravel,
                children: corporateTravelRoutes,
            },
            {
                path: paths.dashboard.officeAddress,
                children: officeAddressRoutes,
            },
            {
                path: paths.dashboard.billPayments,
                children: billPaymentsRoutes,
            },
            {
                path: paths.dashboard.officeSupplies,
                children: officeSuppliesRoutes,
            },
            {
                path: paths.dashboard.bussinessDocs,
                children: bussinessDocsRoutes,
            },
            {
                path: paths.dashboard.connect,
                children: connectRoutes,
            },
            {
                path: paths.dashboard.accounting,
                children: accountingRoutes,
            },
            {
                path: paths.dashboard.payroll,
                children: payrollRoutes,
            },
            {
                path: paths.dashboard.pekoCloud,
                children: pekoCloudRoutes,
            },
            {
                path: paths.dashboard.paymentLink,
                children: paymentLinkRoutes,
            },
            {
                path: paths.dashboard.giftCards,
                children: giftCardsRoutes,
            },
            {
                path: paths.dashboard.giftCards,
                children: perksRoutes,
            },
            {
                path: paths.dashboard.zeroCarbon,
                children: carbonFootprintRoutes,
            },
            {
                path: paths.dashboard.needHelp,
                children: needHelpRoutes,
            },
            {
                path: paths.dashboard.logistics,
                children: logisticsRoutes,
            },
            {
                path: paths.dashboard.licenseRenewal,
                children: licenseRenewalRoutes,
            },
            {
                path: paths.dashboard.documentAttestation,
                children: documentAttestationRoutes,
            },
            {
                path: paths.dashboard.whatsappForBusiness,
                children: WhatsappForBusinessRoutes,
            },
            {
                path: paths.dashboard.works,
                children: workRoutes,
            },
            {
                path: paths.dashboard.eSign,
                children: eSignRoutes,
            },
            {
                path: paths.dashboard.esr,
                children: esrRoutes,
            },
            {
                path: paths.dashboard.vendorPayouts,
                children: vendorPayoutsRoutes,
            },
            {
                path: paths.dashboard.payments,
                children: paymentRoutes,
            },
            {
                path: paths.dashboard.pekoClub,
                children: pekoClubRoutes,
            },
            {
                path: paths.dashboard.insurance,
                children: insuranceRoutes,
            },
            {
                path: paths.dashboard.settings,
                children: settingsRoutes,
            },
            {
                path: paths.dashboard.pekoConnect,
                children: pekoConnectRoutes,
            },
            {
                path: paths.dashboard.hike,
                children: HikeRoutes,
            },
            {
                path: paths.dashboard.emailDomain,
                children: emailDomainRoutes,
            },
            {
                path: paths.dashboard.einvoicing,
                children: eInvoicingRoutes,
            },
            // Notifications routes
            { element: <ServiceNotFound />, path: '503' },
            { element: <ServiceNotAvailable />, path: paths.dashboard.serviceNotAvailable },

            { path: paths.dashboard.notifications, element: <NotificationsPage /> },
        ],
    },
];
