import { JSXElementConstructor, ReactElement, useCallback, useMemo, useRef } from 'react';

import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Divider } from 'antd';
import { useLocation } from 'react-router-dom';

import AccountIcon from '@assets/icons/Accounts.svg';
import AnnouncementIcon from '@assets/icons/Announcements.svg';
import BillPaymentsIcon from '@assets/icons/BillPayments.svg';
import ConnectIcon from '@assets/icons/Connect.svg';
import CorporateCard from '@assets/icons/corporateCard.svg';
import DashboardIcon from '@assets/icons/Dashboard.svg';
import GiftCardsIcon from '@assets/icons/GiftCards.svg';
import NeddHelpIcon from '@assets/icons/Help.svg';
import InsuranceIcon from '@assets/icons/insurance.svg';
import InvoicingIcon from '@assets/icons/Invoicing.svg';
import LogisticsIcon from '@assets/icons/Logistics.svg';
import ManageIcon from '@assets/icons/Manage.svg';
import MoreServicesIcon from '@assets/icons/MoreServices.svg';
import SuppliesIcon from '@assets/icons/office_supplies.svg';
import PayrollIcon from '@assets/icons/Payroll.svg';
import PekoCloudIcon from '@assets/icons/pekocloud.svg';
import ReportsIcon from '@assets/icons/Reports.svg';
import SettingIcon from '@assets/icons/Settings.svg';
import SubscriptionIcon from '@assets/icons/Subscriptions.svg';
import TaxIcon from '@assets/icons/Tax.svg';
import TravelIcon from '@assets/icons/Travel.svg';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { checkRole } from '@utils/checkAccess';

import { NavIcon } from './NavIcon';
import { NavText } from './NavText';

interface NavItem {
    key: string;
    label: React.ReactNode | string;
    icon?: ReactElement<CustomIconComponentProps, string | JSXElementConstructor<any>>;
    stringLabel?: string;
}

export function useNavData() {
    const location = useLocation();
    const { role } = useAppSelector(state => state.reducer.auth);
    const navData = useRef<NavItem[]>();

    const checkRouteIsActive = useCallback(
        (route: string) => {
            const pathArray = location.pathname.split('/').filter(Boolean);
            const firstRoute = pathArray.length > 0 ? `/${pathArray[0]}` : '/';
            return firstRoute === route;
        },
        [location.pathname]
    );

    const sidebarConfig: NavItem[] = useMemo(
        () => [
            {
                key: paths.dashboard.home,
                label: NavText('Dashboard', checkRouteIsActive(paths.dashboard.home)),
                icon: NavIcon(DashboardIcon, checkRouteIsActive(paths.dashboard.home)),
                stringLabel: 'Dashboard',
            },
            {
                key: paths.dashboard.billPayments,
                label: NavText('Bill Payments', checkRouteIsActive(paths.dashboard.billPayments)),
                icon: NavIcon(BillPaymentsIcon, checkRouteIsActive(paths.dashboard.billPayments)),
                stringLabel: 'Bill Payments',
            },
            {
                key: `${paths.dashboard.corporateTravel}?active=1`,
                label: NavText(
                    'Corporate Travel',
                    checkRouteIsActive(paths.dashboard.corporateTravel)
                ),
                icon: NavIcon(
                    TravelIcon,
                    checkRouteIsActive(paths.dashboard.corporateTravel),
                    true
                ),
                stringLabel: 'Corporate Travel',
            },
            {
                key: paths.dashboard.payroll,
                label: NavText('Payroll', checkRouteIsActive(paths.dashboard.payroll), 'new'),
                icon: NavIcon(PayrollIcon, checkRouteIsActive(paths.dashboard.payroll)),
                stringLabel: 'Payroll',
            },
            {
                key: paths.dashboard.officeSupplies,
                label: NavText(
                    'Office Supplies',
                    checkRouteIsActive(paths.dashboard.officeSupplies)
                ),
                icon: NavIcon(SuppliesIcon, checkRouteIsActive(paths.dashboard.officeSupplies)),
                stringLabel: 'Office Supplies',
            },
            {
                key: paths.dashboard.subscriptions,
                label: NavText('Softwares', checkRouteIsActive(paths.dashboard.subscriptions)),
                icon: NavIcon(SubscriptionIcon, checkRouteIsActive(paths.dashboard.subscriptions)),
                stringLabel: 'Softwares',
            },
            {
                key: paths.dashboard.logistics,
                label: NavText('Logistics', checkRouteIsActive(paths.dashboard.logistics)),
                icon: NavIcon(LogisticsIcon, checkRouteIsActive(paths.dashboard.logistics)),
                stringLabel: 'Logistics',
            },
            {
                key: paths.dashboard.giftCards,
                label: NavText('Gift Cards', checkRouteIsActive(paths.dashboard.giftCards)),
                icon: NavIcon(GiftCardsIcon, checkRouteIsActive(paths.dashboard.giftCards)),
                stringLabel: 'Gift Cards',
            },
            {
                key: paths.dashboard.connect,
                label: NavText('Marketplace', checkRouteIsActive(paths.dashboard.connect), 'free'),
                icon: NavIcon(ConnectIcon, checkRouteIsActive(paths.dashboard.connect)),
                stringLabel: 'Marketplace',
            },
            {
                key: paths.dashboard.accounting,
                label: NavText('Tax & More', checkRouteIsActive(paths.dashboard.accounting), 'new'),
                icon: NavIcon(TaxIcon, checkRouteIsActive(paths.dashboard.accounting)),
                stringLabel: 'Tax & More',
            },
            {
                key: paths.dashboard.invoicing,
                label: NavText('The Collector', checkRouteIsActive(paths.dashboard.invoicing)),
                icon: NavIcon(InvoicingIcon, checkRouteIsActive(paths.dashboard.invoicing)),
                stringLabel: 'The Collector',
            },
            {
                key: paths.dashboard.einvoicing,
                label: NavText('E-Invoicing', checkRouteIsActive(paths.dashboard.einvoicing)),
                icon: NavIcon(InvoicingIcon, checkRouteIsActive(paths.dashboard.einvoicing)),
                stringLabel: 'E-Invoicing',
            },
            {
                key: paths.dashboard.insurance,
                label: NavText('Insurance', checkRouteIsActive(paths.dashboard.insurance)),
                icon: NavIcon(InsuranceIcon, checkRouteIsActive(paths.dashboard.insurance)),
                stringLabel: 'Insurance',
            },
            {
                key: paths.dashboard.corporateCard,
                label: NavText(
                    'Corporate Cards',
                    checkRouteIsActive(paths.dashboard.corporateCard)
                ),
                icon: NavIcon(CorporateCard, checkRouteIsActive(paths.dashboard.corporateCard)),
                stringLabel: 'Corporate Cards',
            },
            {
                key: paths.dashboard.pekoCloud,
                label: NavText('Peko Cloud', checkRouteIsActive(paths.dashboard.pekoCloud)),
                icon: NavIcon(PekoCloudIcon, checkRouteIsActive(paths.dashboard.pekoCloud)),
                stringLabel: 'Peko Cloud',
            },
            {
                key: paths.dashboard.moreServices,
                label: NavText('More Services', checkRouteIsActive(paths.dashboard.moreServices)),
                icon: NavIcon(MoreServicesIcon, checkRouteIsActive(paths.dashboard.moreServices)),
                stringLabel: 'More Services',
            },
            { key: '', label: <Divider /> },
            {
                key: paths.dashboard.reports,
                label: NavText('Reports', checkRouteIsActive(paths.dashboard.reports)),
                icon: NavIcon(ReportsIcon, checkRouteIsActive(paths.dashboard.reports)),
                stringLabel: 'Reports',
            },
            {
                key: paths.dashboard.needHelp,
                label: NavText('Need Help?', checkRouteIsActive(paths.dashboard.needHelp)),
                icon: NavIcon(NeddHelpIcon, checkRouteIsActive(paths.dashboard.needHelp)),
                stringLabel: 'Need Help',
            },
            {
                key: paths.dashboard.settings,
                label: NavText('Settings', checkRouteIsActive(paths.dashboard.settings)),
                icon: NavIcon(SettingIcon, checkRouteIsActive(paths.dashboard.settings)),
                stringLabel: 'Settings',
            },
        ],
        [checkRouteIsActive]
    );

    const adminSidebarConfig: NavItem[] = useMemo(
        () => [
            {
                key: checkRole('dashboard'),
                label: NavText('Dashboard', location.pathname.includes(checkRole('dashboard'))),
                icon: NavIcon(DashboardIcon, location.pathname.includes(checkRole('dashboard'))),
                stringLabel: 'Dashboard',
            },
            {
                key: checkRole('accounts'),
                label: NavText('Accounts', location.pathname.includes(checkRole('accounts'))),
                icon: NavIcon(AccountIcon, location.pathname.includes(checkRole('accounts'))),
                stringLabel: 'Accounts',
            },
            {
                key: checkRole('users'),
                label: NavText('Users', location.pathname.includes(checkRole('users'))),
                icon: NavIcon(AccountIcon, location.pathname.includes(checkRole('users'))),
                stringLabel: 'Users',
            },
            {
                key: checkRole('announcement'),
                label: NavText(
                    'Announcements',
                    location.pathname.includes(checkRole('announcement'))
                ),
                icon: NavIcon(
                    AnnouncementIcon,
                    location.pathname.includes(checkRole('announcement'))
                ),
                stringLabel: 'Announcements',
            },
            {
                key: checkRole('officeSupplies'),
                label: NavText(
                    'Office Supplies',
                    location.pathname.includes(checkRole('officeSupplies'))
                ),
                icon: NavIcon(
                    SuppliesIcon,
                    location.pathname.includes(checkRole('officeSupplies'))
                ),
                stringLabel: 'Office Supplies',
            },
            {
                key: checkRole('reports'),
                label: NavText('Reports', location.pathname.includes(checkRole('reports'))),
                icon: NavIcon(ReportsIcon, location.pathname.includes(checkRole('reports'))),
                stringLabel: 'Reports',
            },
            {
                key: checkRole('manage'),
                label: NavText('Manage', location.pathname.includes(checkRole('manage'))),
                icon: NavIcon(ManageIcon, location.pathname.includes(checkRole('manage'))),
                stringLabel: 'Manage',
            },
            {
                key: checkRole('systemConfiguration'),
                label: NavText(
                    'System Configuration',
                    location.pathname.includes(checkRole('systemConfiguration'))
                ),
                icon: NavIcon(
                    SettingIcon,
                    location.pathname.includes(checkRole('systemConfiguration'))
                ),
                stringLabel: 'System Configuration',
            },
            {
                key: checkRole('paymentLinks'),
                label: NavText(
                    'Payment Links',
                    location.pathname.includes(checkRole('paymentLinks'))
                ),
                icon: NavIcon(ManageIcon, location.pathname.includes(checkRole('paymentLinks'))),
                stringLabel: 'Payment Links',
            },
            {
                key: checkRole('settings'),
                label: NavText('Settings', location.pathname.includes(checkRole('settings'))),
                icon: NavIcon(SettingIcon, location.pathname.includes(checkRole('settings'))),
                stringLabel: 'Settings',
            },
            {
                key: checkRole('needHelp'),
                label: NavText('Need Help?', location.pathname.includes(checkRole('needHelp'))),
                icon: NavIcon(NeddHelpIcon, location.pathname.includes(checkRole('needHelp'))),
                stringLabel: 'Need Help',
            },
        ],
        [location.pathname]
    );

    const generateCorporateData = useCallback(() => {
        const items: NavItem[] = sidebarConfig.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
        }));

        navData.current = items;
    }, [sidebarConfig]);

    const generateSystemData = useCallback(() => {
        const items = adminSidebarConfig.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
        }));

        navData.current = items;
    }, [adminSidebarConfig]);

    if (role === UserRole.CORPORATE) {
        generateCorporateData();
    } else if (role === UserRole.SYSTEM) {
        generateSystemData();
    }

    return navData.current;
}
