import { Suspense, lazy } from 'react';

import { Skeleton } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';

// layouts
import DashboardLayout from '@layouts/DashboardLayout';
import { paths } from '@routes/paths';
import AuthGuard from '@src/guard/AuthGuard';
// import IdleGuard from '@src/guard/IdleGuard';
import RoleGuard from '@src/guard/RoleGuard';
import SystemUserGuard from '@src/guard/SystemUserGuard';
import { useAppSelector } from '@src/hooks/store';

const LinkCreated = lazy(() => import('@src/domains/admin/paymentLinks/pages/LinkCreated'));
const CreateLink = lazy(() => import('@src/domains/admin/paymentLinks/pages/CreateLinkPage'));
const PaymentLinks = lazy(() => import('@src/domains/admin/paymentLinks/pages/PaymentLinks'));
const Profile = lazy(() => import('@src/domains/systemUser/profile/pages/Profile'));
const Accounts = lazy(() => import('@src/domains/admin/accounts/pages/Accounts'));
const Settings = lazy(() => import('@src/domains/admin/settings/page/Settings'));
const SystemConfigration = lazy(
    () => import('@src/domains/admin/systemConfigration/pages/SystemConfigration')
);
const Manage = lazy(() => import('@src/domains/admin/manage/pages/Manage'));
const Reports = lazy(() => import('@src/domains/admin/reports/pages/Reports'));
const Users = lazy(() => import('@src/domains/admin/users/pages/Users'));
const Orders = lazy(() => import('@src/domains/admin/officeSupplies/pages/Home'));
const Notifications = lazy(
    () => import('@src/domains/admin/notifications/pages/NotificationsList')
);
const NeedHelpAdmin = lazy(() => import('@src/domains/admin/support/pages/NeedHelp'));
const ProductsBulkUpload = lazy(
    () => import('@src/domains/admin/officeSupplies/pages/ProductsBulkUpload')
);
const CommonBulkUpload = lazy(() => import('@src/domains/admin/manage/pages/BulkUploadPage'));
const EsrView = lazy(() => import('@src/domains/admin/manage/component/esr/EsrView'));
const roleToDashboardComponent = {
    admin: lazy(() => import('@src/domains/admin/dashboard/pages/Dashboard')),
    ecom_manager: lazy(() => import('@src/domains/systemUser/ecom_manager/home/pages/Dashboard')),
    partner: lazy(() => import('@src/domains/systemUser/partner/home/pages/Dashboard')),
};

const LazyDashboard = () => {
    const { roleName } = useAppSelector(state => state.reducer.auth);
    let DashboardComponent = (roleToDashboardComponent as Record<string, any>)[roleName];
    if (!DashboardComponent) {
        DashboardComponent = roleToDashboardComponent.admin;
    }
    return <DashboardComponent />;
};

export const systemUserRoutes = [
    {
        path: '',
        element: (
            <AuthGuard>
                <SystemUserGuard>
                    {/* <IdleGuard> */}
                    <DashboardLayout>
                        <RoleGuard>
                            <Suspense fallback={<Skeleton />}>
                                <Outlet />
                            </Suspense>
                        </RoleGuard>
                    </DashboardLayout>
                    {/* </IdleGuard> */}
                </SystemUserGuard>
            </AuthGuard>
        ),
        children: [
            {
                element: <Navigate to={paths.systemUser.dashboard} replace />,
                index: true,
            },
            { element: <Profile />, path: paths.systemUser.profile },
            {
                element: <LazyDashboard />,
                path: paths.systemUser.dashboard,
            },
            { element: <Users />, path: paths.systemUser.users },
            {
                path: paths.systemUser.officeSupplies,
                children: [
                    { element: <Orders />, index: true },
                    { element: <ProductsBulkUpload />, path: 'bulk-upload' },
                ],
            },
            { element: <Accounts />, path: paths.systemUser.accounts },
            { element: <Reports />, path: paths.systemUser.reports },
            {
                path: paths.systemUser.manage,
                children: [
                    { element: <Manage />, index: true },
                    { element: <CommonBulkUpload />, path: 'bulk' },
                    { element: <EsrView />, path: paths.systemUser.esrView },
                ],
            },
            {
                path: paths.systemUser.paymentLinks,
                children: [
                    { element: <PaymentLinks />, index: true },
                    { element: <CreateLink />, path: 'create-payment-link' },
                    { element: <LinkCreated />, path: 'create-payment-link/created' },
                ],
            },
            { element: <Settings />, path: paths.systemUser.settings },
            { element: <NeedHelpAdmin />, path: paths.systemUser.needHelp },
            { element: <Notifications />, path: paths.systemUser.announcement },
            { element: <SystemConfigration />, path: paths.systemUser.systemConfiguration },
        ],
    },
];
