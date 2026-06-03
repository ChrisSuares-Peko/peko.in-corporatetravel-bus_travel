import { ArrowIcon, BalloonIcon, CalenderIcon, MedicalKitIcon } from '../assets/icons/leaveSummary';

interface ILeaveSummaryData {
    title: string;
    value: string;
    icon: string;
}

export const leaveSummaryData: ILeaveSummaryData[] = [
    {
        title: 'Annual Leave',
        value: '00',
        icon: ArrowIcon,
    },
    {
        title: 'Medical Leave ',
        value: '05',
        icon: MedicalKitIcon,
    },
    {
        title: 'Other  Leaves',
        value: '10',
        icon: BalloonIcon,
    },
    {
        title: 'Unpaid Leave ',
        value: '15',
        icon: CalenderIcon,
    },
];
