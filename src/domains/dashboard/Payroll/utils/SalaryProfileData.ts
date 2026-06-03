import {
    CalenderIcon,
    CarIcon,
    ClipboardIcon,
    HomeIcon,
    SuitCaseIcon,
    TimeClockIcon,
    WalletIcon,
} from '../assets/icons/salaryProfile';

interface ISalaryProfileData {
    title: string;
    icon: string;
    subtitle: string;
}

export const SalaryProfileData: ISalaryProfileData[] = [
    {
        title: 'Product Development',
        subtitle: 'Department',
        icon: ClipboardIcon,
    },
    {
        title: 'AED 10,000',
        subtitle: 'Basic Salary',
        icon: WalletIcon,
    },
    {
        title: 'AED 1,000',
        subtitle: 'Home Allowance Salary',
        icon: HomeIcon,
    },
    {
        title: 'AED 5,000',
        subtitle: 'Travel Allowance',
        icon: CarIcon,
    },
    {
        title: 'AED 1,000',
        subtitle: 'Other Allowance',
        icon: WalletIcon,
    },
    {
        title: 'N/A',
        subtitle: 'Total Gratuity',
        icon: SuitCaseIcon,
    },
    {
        title: '9.30 PM to 5.30 PM GST',
        subtitle: '9.30 PM to 5.30 PM GST',
        icon: TimeClockIcon,
    },
    {
        title: '12 February 2023',
        subtitle: 'Joining date',
        icon: CalenderIcon,
    },
];
