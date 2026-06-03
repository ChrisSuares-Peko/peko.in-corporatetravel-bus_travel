import { lazy } from 'react';

import { paths } from '../paths';

const EInvoicingShell = lazy(
    () => import('@src/domains/dashboard/EInvoicing/components/EInvoicingShell')
);
const EntryRedirect = lazy(
    () => import('@src/domains/dashboard/EInvoicing/components/EInvoicingEntryRedirect')
);
const ActivationWall = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/ActivationWall')
);
const Onboarding = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/Onboarding'));
const Overview = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/Overview'));
const CreateSalesInvoice = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/CreateSalesInvoice')
);
const CreateCreditNote = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/CreateCreditNote')
);
const CreatePurchaseInvoice = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/CreatePurchaseInvoice')
);
const CreatePurchaseCreditNote = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/CreatePurchaseCreditNote')
);
const DocumentList = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/DocumentList'));
const DocumentDetail = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/DocumentDetail')
);
const BulkUpload = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/BulkUpload'));
const Archive = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/Archive'));
const SettingsProfile = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/SettingsProfile')
);
const SettingsBranches = lazy(
    () => import('@src/domains/dashboard/EInvoicing/pages/SettingsBranches')
);
const SettingsApi = lazy(() => import('@src/domains/dashboard/EInvoicing/pages/SettingsApi'));

export const eInvoicingRoutes = [
    {
        element: <EInvoicingShell />,
        children: [
            {
                index: true,
                element: (
                    <>
                        <EntryRedirect />
                        <Overview />
                    </>
                ),
            },
            { path: paths.einvoicing.activate, element: <ActivationWall /> },
            { path: paths.einvoicing.onboarding, element: <Onboarding /> },
            {
                path: paths.einvoicing.salesInvoices,
                element: (
                    <DocumentList
                        type="sales-invoice"
                        title="Sales invoices"
                        createPath={paths.einvoicing.salesInvoices}
                    />
                ),
            },
            {
                path: `${paths.einvoicing.salesInvoices}/${paths.einvoicing.new}`,
                element: <CreateSalesInvoice />,
            },
            {
                path: `${paths.einvoicing.salesInvoices}/:id`,
                element: <DocumentDetail />,
            },
            {
                path: paths.einvoicing.creditNotes,
                element: (
                    <DocumentList
                        type="sales-credit-note"
                        title="Credit notes"
                        createPath={paths.einvoicing.creditNotes}
                    />
                ),
            },
            {
                path: `${paths.einvoicing.creditNotes}/${paths.einvoicing.new}`,
                element: <CreateCreditNote />,
            },
            {
                path: `${paths.einvoicing.creditNotes}/:id`,
                element: <DocumentDetail />,
            },
            {
                path: paths.einvoicing.purchaseInvoices,
                element: (
                    <DocumentList
                        type="purchase-invoice"
                        title="Purchase invoices"
                        createPath={paths.einvoicing.purchaseInvoices}
                    />
                ),
            },
            {
                path: `${paths.einvoicing.purchaseInvoices}/${paths.einvoicing.new}`,
                element: <CreatePurchaseInvoice />,
            },
            {
                path: `${paths.einvoicing.purchaseInvoices}/:id`,
                element: <DocumentDetail />,
            },
            {
                path: paths.einvoicing.purchaseCreditNotes,
                element: (
                    <DocumentList
                        type="purchase-credit-note"
                        title="Purchase credit notes"
                        createPath={paths.einvoicing.purchaseCreditNotes}
                    />
                ),
            },
            {
                path: `${paths.einvoicing.purchaseCreditNotes}/${paths.einvoicing.new}`,
                element: <CreatePurchaseCreditNote />,
            },
            {
                path: `${paths.einvoicing.purchaseCreditNotes}/:id`,
                element: <DocumentDetail />,
            },
            { path: paths.einvoicing.bulkUpload, element: <BulkUpload /> },
            { path: paths.einvoicing.archive, element: <Archive /> },
            { path: paths.einvoicing.settingsProfile, element: <SettingsProfile /> },
            { path: paths.einvoicing.settingsBranches, element: <SettingsBranches /> },
            { path: paths.einvoicing.settingsApi, element: <SettingsApi /> },
        ],
    },
];
