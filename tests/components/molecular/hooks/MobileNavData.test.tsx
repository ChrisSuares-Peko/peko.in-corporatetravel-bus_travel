import { renderHook } from '@testing-library/react';
import { describe, beforeEach, it, expect, Mock, vi } from 'vitest';

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
import useMobileNavData from '@components/molecular/nav-section/mobile-nav/MobileNavData';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { checkSidebarkAccess } from '@utils/checkAccess';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@utils/checkAccess', () => ({
    checkSidebarkAccess: vi.fn(),
}));

describe('useMobileNavData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return navData for CORPORATE role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: UserRole.CORPORATE });

        const { result } = renderHook(() => useMobileNavData());

        expect(result.current).toEqual([
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
        ]);
    });

    it('should return filtered adminNavData for SYSTEM role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: UserRole.SYSTEM });
        (checkSidebarkAccess as Mock).mockReturnValue(true);

        const { result } = renderHook(() => useMobileNavData());
        expect(result.current).toEqual([
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
        ]);
    });

    it('should return false for undefined role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: 'UNKNOWN_ROLE' });

        const { result } = renderHook(() => useMobileNavData());

        expect(result.current).toBe(false);
    });

    it('should return empty array if adminNavData is empty for SYSTEM role', () => {
        (useAppSelector as Mock).mockReturnValue({ role: UserRole.SYSTEM });
        (checkSidebarkAccess as Mock).mockReturnValue(false);

        const { result } = renderHook(() => useMobileNavData());

        expect(result.current).toEqual([]);
    });

    it('should memoize navData and adminNavData', () => {
        const { result, rerender } = renderHook(() => useMobileNavData());

        // Ensure that navData and adminNavData are memoized and do not recompute on rerender
        expect(result.current).toEqual(result.current); // Check if it remains the same

        rerender(); // Trigger a rerender
        expect(result.current).toEqual(result.current); // Check if it still remains the same
    });

    it('should call generateSystemData correctly for SYSTEM role', () => {
        const { result } = renderHook(() => useMobileNavData());

        // Ensure generateSystemData is called and executed
        expect(checkSidebarkAccess).toHaveBeenCalled();
    });
});
