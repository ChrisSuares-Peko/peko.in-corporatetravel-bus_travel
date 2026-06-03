import { useCallback, useMemo } from 'react';

import AccountIcon from '@assets/icons/Accounts.svg';
import AnnouncementIcon from '@assets/icons/Announcements.svg';
import BillPaymentsIcon from '@assets/icons/BillPayments.svg';
import GiftCardsIcon from '@assets/icons/GiftCards.svg';
import NeddHelpIcon from '@assets/icons/Help.svg';
import LogisticsIcon from '@assets/icons/Logistics.svg';
import ManageIcon from '@assets/icons/Manage.svg';
import MoreServicesIcon from '@assets/icons/MoreServices.svg';
import SuppliesIcon from '@assets/icons/office_supplies.svg';
import PayrollIcon from '@assets/icons/Payroll.svg';
import ReportsIcon from '@assets/icons/Reports.svg';
import SettingIcon from '@assets/icons/Settings.svg';
import SubscriptionIcon from '@assets/icons/Subscriptions.svg';
import TravelIcon from '@assets/icons/Travel.svg';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { checkSidebarkAccess } from '@utils/checkAccess';

interface NavItem {
    key: string;
    label: React.ReactNode | string;
    icon?: string;
}
export default function useMobileNavData() {
    const { role } = useAppSelector(state => state.reducer.auth);

    const navData: NavItem[] = useMemo(
        () => [
            {
                key: paths.dashboard.billPayments,
                label: 'Bill Payments',
                icon: BillPaymentsIcon,
            },
            {
                key: paths.dashboard.corporateTravel,
                label: 'Corporate Travel',
                icon: TravelIcon,
            },
            {
                key: paths.dashboard.payroll,
                label: 'Payroll',
                icon: PayrollIcon,
            },
            {
                key: paths.dashboard.officeSupplies,
                label: 'Office Supplies',
                icon: SuppliesIcon,
            },
            {
                key: paths.dashboard.subscriptions,
                label: 'Softwares',
                icon: SubscriptionIcon,
            },
            {
                key: paths.dashboard.logistics,
                label: 'Logistics',
                icon: LogisticsIcon,
            },
            {
                key: paths.dashboard.giftCards,
                label: 'Gift Cards',
                icon: GiftCardsIcon,
            },
            {
                key: paths.dashboard.moreServices,
                label: 'More Services',
                icon: MoreServicesIcon,
            },
        ],
        []
    );
    const adminNavData: NavItem[] = useMemo(
        () => [
            {
                key: paths.systemUser.accounts,
                label: 'Accounts',
                icon: AccountIcon,
            },
            {
                key: paths.systemUser.users,
                label: 'Users',
                icon: AccountIcon,
            },
            {
                key: paths.systemUser.reports,
                label: 'Reports',
                icon: ReportsIcon,
            },
            {
                key: paths.systemUser.needHelp,
                label: 'needHelp',
                icon: NeddHelpIcon,
            },
            {
                key: paths.systemUser.officeSupplies,
                label: 'Office Supplies',
                icon: SuppliesIcon,
            },
            {
                key: paths.systemUser.settings,
                label: 'Settings',
                icon: SettingIcon,
            },
            {
                key: paths.systemUser.systemConfiguration,
                label: 'System Configuration',
                icon: SettingIcon,
            },
            {
                key: paths.systemUser.manage,
                label: 'Manage',
                icon: ManageIcon,
            },
            {
                key: paths.systemUser.announcement,
                label: 'Announcements',
                icon: AnnouncementIcon,
            },
            {
                key: paths.systemUser.needHelp,
                label: 'Need Help',
                icon: NeddHelpIcon,
            },
        ],
        []
    );

    const generateSystemData = useCallback(() => {
        const items = adminNavData
            .filter(item => checkSidebarkAccess(item.label?.toString()!) || item.key === '')
            .map(item => ({
                key: item.key,
                label: item.label,
                icon: item.icon,
            }));
        return items;
    }, [adminNavData]);

    if (role === UserRole.CORPORATE) {
        // const items: NavItem[] = navData
        //     .filter(item => checkCorporateSidebar(item.label as string))
        //     .map(item => ({
        //         key: item.key,
        //         label: item.label,
        //         icon: item.icon,
        //     }));

        return navData;
    }
    if (role === UserRole.SYSTEM) {
        return generateSystemData();
    }

    return false;
}
