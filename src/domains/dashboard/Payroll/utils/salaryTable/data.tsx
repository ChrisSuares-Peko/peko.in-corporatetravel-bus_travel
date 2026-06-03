import { InfoCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { TableColumnsType, Flex, Avatar, Typography, Tooltip, Badge } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { filterState, salarytableType } from '../../types/salaryProfileTypes/employeeSalaryTable';

function getInitials(name: string): string {
    const words = name.split(' ');
    const initials = words
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 3)
        .toUpperCase();
    return initials;
}

const formatDate = (date: any) => new Date(date).toISOString().split('T')[0];

export const employeeSalaryColumns = (filter: filterState): TableColumnsType<salarytableType> => [
    {
        title: <Typography.Text>Name & Employee ID</Typography.Text>,
        dataIndex: 'name',
        key: Math.random().toString(36).substring(2, 11),
        render: (text: string, record: salarytableType) => (
            <Flex gap={10}>
                <Flex align="center">
                    {record.image ? (
                        <Avatar
                            src={record.image}
                            style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                        />
                    ) : (
                        <Avatar style={{ backgroundColor: '#fde3cf', color: 'red' }}>
                            {getInitials(text)}
                        </Avatar>
                    )}
                </Flex>
                <Flex vertical justify="center">
                    <Typography.Text className="text-gray-900 text-base ">
                        <Link
                            style={{ color: '#101828', textDecoration: 'none' }}
                            to={`/${paths.payroll.index}/${paths.payroll.employeesSalary}/${paths.payroll.salaryProfile}`}
                            state={{
                                eId: record.eId,
                                salaryId: record.salaryId,
                                month: filter.month,
                                year: filter.year,
                            }}
                        >
                            {text}
                        </Link>
                        {record?.employeeStatus === 'RESIGNED' ||
                        record?.employeeStatus === 'SUSPENDED' ? (
                            <Tooltip
                                title={`This employee is under notice period. Last working day: ${formatDate(record?.lastWorkingDay)}`}
                            >
                                <InfoCircleFilled
                                    style={{
                                        marginLeft: '8px',
                                        color: '#1890ff',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Tooltip>
                        ) : null}
                    </Typography.Text>

                    <Typography.Text className="text-slate-500 text-sm font-normal">
                        {record?.employeeId}
                    </Typography.Text>
                </Flex>
            </Flex>
        ),
    },

    {
        title: <Typography.Text>Role</Typography.Text>,
        dataIndex: 'role',
        key: Math.random().toString(36).substring(2, 11),
        render: (text: string, record: salarytableType) => (
            <Flex gap={10}>
                <Flex vertical justify="center">
                    <Typography.Text className="  text-gray-900 text-base font-medium">
                        {text}
                    </Typography.Text>
                    <Typography.Text className="text-slate-500 text-sm font-normal">
                        {record.department}
                    </Typography.Text>
                </Flex>
            </Flex>
        ),
    },
    {
        title: <Typography.Text>Basic Salary</Typography.Text>,
        dataIndex: 'basicSalary',
        key: Math.random().toString(36).substring(2, 11),
    },
    {
        title: (
            <span>
                <Typography.Text>Monthly Salary</Typography.Text>
                &nbsp;&nbsp;
                <Tooltip title="Monthly Salary = Basic Salary + Housing Allowance + Transport Allowance + Other Allowances">
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: 'monthlySalary',
        key: Math.random().toString(36).substring(2, 11),
    },
    {
        title: (
            <span>
                <Typography.Text>Others</Typography.Text>
                &nbsp;&nbsp;
                <Tooltip title="Others = Bonus + Incentives + Overtime Pay">
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: 'others',
        key: Math.random().toString(36).substring(2, 11),
    },
    {
        title: (
            <span>
                <Typography.Text>Total Deduction</Typography.Text>
                &nbsp;&nbsp;
                <Tooltip title="Total Deduction = Leave deductions + Other deductions + Non-Worked days deduction">
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: 'totalDeduction',
        key: Math.random().toString(36).substring(2, 11),
    },
    {
        title: <Typography.Text>Total Salary</Typography.Text>,
        dataIndex: 'totalSalary',
        key: Math.random().toString(36).substring(2, 11),
    },

    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: Math.random().toString(36).substring(2, 11),
        render: text => {
            if (text === 'PAID') {
                return (
                    <Badge
                        status="success"
                        text="Paid"
                        className="px-2 rounded-2xl"
                        style={{ backgroundColor: '#ECFDF3', color: '#027A48' }}
                    />
                );
            }
            if (text === 'PENDING') {
                return (
                    <Badge
                        status="error"
                        text="Pending"
                        className="px-2 rounded-2xl"
                        style={{ backgroundColor: '#FFF2EA', color: '#F15046' }}
                    />
                );
            }
            if (text === 'APPROVED') {
                return (
                    <Badge
                        status="success"
                        text="Approved"
                        className="px-1 rounded-2xl"
                        style={{ backgroundColor: '#ECFDF3', color: '#027A48' }}
                    />
                );
            }
            if (text === 'FAILD') {
                return (
                    <Badge
                        status="error"
                        text="Pending"
                        className="px-2 rounded-2xl"
                        style={{ backgroundColor: '#FFF2EA', color: '#F15046' }}
                    />
                );
            }
            if (text === 'UPCOMING') {
                return (
                    <Badge
                        status="warning"
                        text="Upcoming"
                        className="rounded-2xl"
                        // style={{ color: '#FAAD14' }}
                        style={{
                            color: '#FAAD14',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '12px', // Adjust text size
                            padding: '0 4px', // Adjust padding
                        }}
                    />
                );
            }
            return <Badge status="default" text={text} className="px-2 rounded-2xl" />;
        },
        // filters: [
        //     { text: 'PENDING', value: 'PENDING' },
        //     { text: 'PAID', value: 'PAID' },
        //     // { text: 'UPCOMING', value: 'UPCOMING' },
        //     // { text: 'FAILD', value: 'FAILD' },
        // ],
        // onFilter: (value, record) => record.status === value,
    },
];

export const monthsArray = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
];
let currentYear = new Date().getFullYear();
currentYear += 1;
export const yearsArray = Array.from({ length: 10 }, (_, index) => {
    const year = (currentYear - index).toString();
    return { label: year, value: year };
});

export const years = [
    ...Array.from({ length: 5 }, (_, index) => {
        const year = (currentYear - (5 - index)).toString();
        return { label: year, value: year };
    }),
    ...Array.from({ length: 6 }, (_, index) => {
        const year = (currentYear + index).toString();
        return { label: year, value: year };
    }),
];
