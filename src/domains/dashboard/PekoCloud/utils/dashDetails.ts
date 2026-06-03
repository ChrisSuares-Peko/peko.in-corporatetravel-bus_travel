import assetsLock from '@domains/dashboard/PekoCloud/assets/icons/assetsLock.svg';
import devices from '@domains/dashboard/PekoCloud/assets/icons/devices.svg';
import documentRed from '@domains/dashboard/PekoCloud/assets/icons/document-red.svg';
import documents from '@domains/dashboard/PekoCloud/assets/icons/documents.svg';
import dollarRound from '@domains/dashboard/PekoCloud/assets/icons/dollar-round.svg';
import fleetBus from '@domains/dashboard/PekoCloud/assets/icons/fleet-bus.svg';
import laptop from '@domains/dashboard/PekoCloud/assets/icons/laptop-red.svg';
import subscriptions from '@domains/dashboard/PekoCloud/assets/icons/subscriptions.svg';
import userChecked from '@domains/dashboard/PekoCloud/assets/icons/user-checked.svg';
import userGroup from '@domains/dashboard/PekoCloud/assets/icons/user-group.svg';
import wallet from '@domains/dashboard/PekoCloud/assets/icons/wallet.svg';
import AE_logo from '@domains/dashboard/PekoCloud/assets/images/AE_logo.png';
import EID_logo from '@domains/dashboard/PekoCloud/assets/images/EID_logo.png';
import { paths } from '@src/routes/paths';

export const dashboardData = [
    {
        title: 'Total Documents',
        value: '25',
        isCurrency: false,
        icon: documents,
        bgColor: 'bg-[#F3FFEF]',
    },
    {
        title: 'Total Subscriptions',
        value: '12',
        isCurrency: false,
        icon: subscriptions,
        bgColor: 'bg-[#FFF6F2]',
    },
    {
        title: 'Total Subscription Spent',
        value: '42000',
        isCurrency: true,
        icon: wallet,
        bgColor: 'bg-[#FFF0FC]',
    },
    {
        title: 'Total Assets',
        value: '88',
        isCurrency: false,
        icon: assetsLock,
        bgColor: 'bg-[#FFF0FC]',
    },
];

export const ReminderData = [
    {
        title: 'Kashifs Emirates ID renewal',
        value: '250',
        icon: AE_logo,
        subLabel: 'Valid until 15 March 2025',
    },
    {
        title: 'Kashifs Emirates ID renewal',
        value: '250',
        icon: EID_logo,
        subLabel: 'Valid until 15 March 2025',
    },
    {
        title: 'Kashifs Emirates ID renewal',
        value: '250',
        icon: AE_logo,
        subLabel: 'Valid until 15 March 2025',
    },
    {
        title: 'Kashifs Emirates ID renewal',
        value: '250',
        icon: EID_logo,
        subLabel: 'Valid until 15 March 2025',
    },
    {
        title: 'Kashifs Emirates ID renewal',
        value: '250',
        icon: EID_logo,
        subLabel: 'Valid until 15 March 2025',
    },
];

export const ReminderDataList = [ReminderData, ReminderData, ReminderData];

export const activities = [
    {
        image: 'https://static.vecteezy.com/system/resources/previews/014/018/579/original/ms-365-logo-on-transparent-background-free-vector.jpg',
        label: 'Your Microsoft 365 subscription is due for renewal on',
        date: ' July 24, 2025.',
    },
    {
        image: 'https://static.vecteezy.com/system/resources/previews/014/018/579/original/ms-365-logo-on-transparent-background-free-vector.jpg',
        label: 'Your Microsoft 365 subscription is due for renewal on',
        date: ' July 24, 2025.',
    },
    {
        image: 'https://static.vecteezy.com/system/resources/previews/014/018/579/original/ms-365-logo-on-transparent-background-free-vector.jpg',
        label: 'Your Microsoft 365 subscription is due for renewal on',
        date: ' July 24, 2025.',
    },
    {
        image: 'https://static.vecteezy.com/system/resources/previews/014/018/579/original/ms-365-logo-on-transparent-background-free-vector.jpg',
        label: 'Your Microsoft 365 subscription is due for renewal on',
        date: ' July 24, 2025.',
    },
    {
        image: 'https://static.vecteezy.com/system/resources/previews/014/018/579/original/ms-365-logo-on-transparent-background-free-vector.jpg',
        label: 'Your Microsoft 365 subscription is due for renewal on',
        date: ' July 24, 2025.',
    },
];

export const navMenuDetails = [
    {
        icon: documentRed,
        title: 'Company Documents',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.companyDocuments}`,
    },

    {
        icon: userChecked,
        title: 'Ownership Documents',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.ownershipDocuments}`,
    },
    {
        icon: dollarRound,
        title: 'Financials',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.financials}`,
    },
    {
        icon: userGroup,
        title: 'Employee Details ',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.employeeDetails}`,
    },
    {
        icon: devices,
        title: 'Subscriptions',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.subscriptions}`,
    },
    {
        icon: laptop,
        title: 'Assets',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.assets}`,
    },
    {
        icon: fleetBus,
        title: 'Fleet Management',
        isActive: true,
        link: `/${paths.pekoCloud.index}/${paths.pekoCloud.fleet}`,
    },
];

export const UpcomingActivityData = [
    {
        title: 'New Employee Joined',
        description:
            'Responsible for driving revenue growth by identifying and pursuing new business opportunities, a',
        date: '20-10-2023',
    },
    {
        title: 'New Employee Joined',
        description:
            'Responsible for driving revenue growth by identifying and pursuing new business opportunities, a',
        date: '20-10-2023',
    },
    {
        title: 'New Employee Joined',
        description:
            'Responsible for driving revenue growth by identifying and pursuing new business opportunities, a',
        date: '20-10-2023',
    },
];
