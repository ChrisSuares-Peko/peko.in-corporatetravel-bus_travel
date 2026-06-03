import { TabsProps } from 'antd';

export const HRSettingsData = [
    {
        title: 'Maximum Paid Leave Settings ',
        fields: [
            {
                name: 'annualLeave',
                label: 'Annual leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'sickLeave',
                label: 'Sick leave',
                placeholder: '',
                type: 'number',
            },

            {
                name: 'parentalLeave',
                label: 'Parental leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'sabbaticalLeave',
                label: 'Sabbatical Leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Study  leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Hajj and Umra leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Maternity leave',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Official Leaves And Vacations',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Other Paid Leaves',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Leave Eligibility Time Period ( In Years )',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'Salary Cycle Day',
                placeholder: '',
                type: 'number',
            },
        ],
    },
    {
        title: 'Gratuity',
        fields: [
            {
                name: 'annualLeave',
                label: '1-5 Years',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'sickLeave',
                label: 'Days',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'parentalLeave',
                label: 'More than 5 years',
                placeholder: '',
                type: 'number',
            },
            {
                name: 'sickLeave',
                label: 'Days',
                placeholder: '',
                type: 'number',
            },
        ],
    },
    {
        title: 'Official Documents',
        fields: [
            {
                name: 'hrManagerName',
                label: 'HR Manager Name',
                placeholder: '',
                type: 'text',
            },
            {
                name: 'hrManagerSignature',
                label: 'HR Manager Signature',
                placeholder: '',
                type: 'upload',
            },
            {
                name: 'companyStamp',
                label: 'Company Official Stamp',
                placeholder: '',
                type: 'upload',
            },
        ],
    },
];

export const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Payroll  Settings',
        children: '',
    },
    {
        key: '2',
        label: ' Leave Summary',
        children: '',
    },
    {
        key: '3',
        label: 'Reimbursement ',
        children: '',
    },
    {
        key: '4',
        label: 'WPS',
        children: '',
    },
];

export const settings = [
    {
        title: 'Total Amount',
        value: 'AED 299',
    },
    {
        title: 'Total Employees',
        value: '50',
    },
    {
        title: 'Status',
        value: 'Active',
    },
    {
        title: 'Monthly',
        value: 'AED 40',
    },
    {
        title: 'Plan started',
        value: '12/10/2024',
    },
    {
        title: 'Value until',
        value: '12/10/2024',
    },
];
