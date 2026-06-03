import { ReactNode } from 'react';

import { Alert } from 'antd';
import {
    CloudUploadOutlined,
    DashboardOutlined,
    FileSyncOutlined,
    FileTextOutlined,
    InboxOutlined,
    MinusCircleOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useEInvoicingStatus } from '../hooks/useEInvoicingStatus';

const NAV_ITEMS = [
    { key: '', label: 'Overview', Icon: DashboardOutlined },
    { key: paths.einvoicing.salesInvoices, label: 'Sales Invoices', Icon: FileTextOutlined },
    { key: paths.einvoicing.creditNotes, label: 'Credit Notes', Icon: FileSyncOutlined },
    { key: paths.einvoicing.purchaseInvoices, label: 'Purchase Invoices', Icon: ShoppingCartOutlined },
    { key: paths.einvoicing.purchaseCreditNotes, label: 'Purchase Credit Notes', Icon: MinusCircleOutlined },
    { key: paths.einvoicing.bulkUpload, label: 'Bulk Upload', Icon: CloudUploadOutlined },
    { key: paths.einvoicing.archive, label: 'Archive', Icon: InboxOutlined },
];

const SETTINGS_ITEMS = [
    { key: paths.einvoicing.settingsProfile, label: 'Business Profile' },
    { key: paths.einvoicing.settingsBranches, label: 'Branches' },
    { key: paths.einvoicing.settingsApi, label: 'API Keys' },
];

// Routes that render full-screen without the sidebar
const NO_SIDEBAR_SEGMENTS = [
    '',
    paths.einvoicing.activate,
    paths.einvoicing.onboarding,
];

interface ShellProps {
    children?: ReactNode;
}

const EInvoicingShell = ({ children }: ShellProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { status } = useEInvoicingStatus();

    const base = paths.dashboard.einvoicing;
    const sub = location.pathname.replace(base, '').replace(/^\//, '');
    const topLevel = sub.split('/')[0] ?? '';

    const hideSidebar = NO_SIDEBAR_SEGMENTS.includes(topLevel);

    if (hideSidebar) {
        return (
            <div>
                {status === 'PENDING' && (
                    <Alert
                        type="info"
                        showIcon
                        message="Setup is still in progress"
                        description="We're finalising your e-invoicing account. Invoice issuing is locked until setup completes."
                        style={{ marginBottom: 16 }}
                    />
                )}
                {children ?? <Outlet />}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100%' }}>
         

            {/* Main content */}
            <main style={{ flex: 1, minWidth: 0, padding: '0 0px', overflow: 'auto' }}>
                {status === 'PENDING' && (
                    <Alert
                        type="info"
                        showIcon
                        message="Setup is still in progress"
                        description="We're finalising your e-invoicing account. Invoice issuing is locked until setup completes."
                        style={{ margin: '16px 0' }}
                    />
                )}
                {children ?? <Outlet />}
            </main>
        </div>
    );
};

export default EInvoicingShell;
