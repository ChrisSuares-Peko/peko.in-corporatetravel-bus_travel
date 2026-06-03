import ExpenseIcon from '@domains/dashboard/accounting/assets/icons/Expense.svg';
import navItemAssetManagement from '@domains/dashboard/accounting/assets/icons/navItemAssetManagement.svg';
import navItemAuditing from '@domains/dashboard/accounting/assets/icons/navItemAuditing.svg';
import navItemDueDiligence from '@domains/dashboard/accounting/assets/icons/navItemDueDiligence.svg';
import navItemInternalAuditing from '@domains/dashboard/accounting/assets/icons/navItemInternalAuditing.svg';
import navItemManagementConsultancy from '@domains/dashboard/accounting/assets/icons/navItemManagementConsultancy.svg';
import PayableIcon from '@domains/dashboard/accounting/assets/icons/Payable.svg';
import ReceivableIcon from '@domains/dashboard/accounting/assets/icons/Receivable.svg';
import { paths } from '@src/routes/paths';

export const dashboardData = [
    {
        title: 'Payable',
        value: '78,560',
        icon: PayableIcon,
        bgColor: 'bg-bgSkin',
    },
    {
        title: 'Receivable',
        value: '92,540',
        icon: ReceivableIcon,
        bgColor: 'bg-bgLime',
    },
    {
        title: 'Expense',
        value: '12,000',
        icon: ExpenseIcon,
        bgColor: 'bg-bgOrangeShade',
    },
];

export const navMenuDetails = [
    {
        icon: navItemAuditing,
        title: 'Auditing',
        isActive: true,
        link: '',
    },

    {
        icon: navItemInternalAuditing,
        title: 'Internal Auditing',
        isActive: true,
        link: '',
    },
    {
        icon: navItemDueDiligence,
        title: 'Due Diligence',
        isActive: true,
        link: '',
    },
    {
        icon: navItemManagementConsultancy,
        title: 'Management Consultancy',
        isActive: true,
        link: '',
    },
    {
        icon: navItemAssetManagement,
        title: 'Asset Management ',
        isActive: true,
        link: paths.payroll.announcements,
    },
];

export const UpcomingActivityData = [
    {
        description: 'The salary entry has been successfully passed to the magic ledger',
        success: true,
    },
    {
        description: 'The salary entry has been successfully passed to the magic ledger',
        success: false,
    },
    {
        description: 'The salary entry has been successfully passed to the magic ledger',
        success: true,
    },
    {
        description: 'The salary entry has been successfully passed to the magic ledger',
        success: false,
    },
];
