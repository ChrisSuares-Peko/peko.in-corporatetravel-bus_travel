import employers from '@domains/dashboard/Payroll/assets/icons/employers.svg';
import prevSalaray from '@domains/dashboard/Payroll/assets/icons/prevSalaray.svg';
import totalSalary from '@domains/dashboard/Payroll/assets/icons/totalSalary.svg';

export const dashboardData = [
    {
        title: 'Active Employees',
        value: '25',
        isCurrency: false,
        icon: employers,
    },
    {
        title: 'Total Salary',
        value: '42,000',
        isCurrency: true,
        icon: totalSalary,
    },
    {
        title: 'Next Month Salary',
        value: '42,000',
        isCurrency: true,
        icon: prevSalaray,
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
