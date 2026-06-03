import { DownloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { TableProps, Space, Button, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { bonusTable } from '../../types/salaryProfileTypes/bonustypes';
import { incentiveTable } from '../../types/salaryProfileTypes/incentiveTypes';
import { overtimeTable } from '../../types/salaryProfileTypes/overtimeTypes';
import { reimbursementTableType } from '../../types/salaryProfileTypes/ReimbursementTypes';

const formatText = (text: string | number) => {
    if (!text) return '';
    const stringText = String(text); // Convert any input to a string
    return stringText.charAt(0).toUpperCase() + stringText.slice(1).toLowerCase();
};
export const incentiveColumn = (
    handleDelete: (record: incentiveTable) => void,
    handleEdit: (record: incentiveTable) => void
): TableProps<incentiveTable>['columns'] => [
    {
        title: <Typography.Text>Date Added</Typography.Text>,
        dataIndex: 'dateAdded',
        key: 'dateAdded',
    },
    {
        title: <Typography.Text>Effective Date</Typography.Text>,
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
    },
    {
        title: <Typography.Text>Salary Month</Typography.Text>,
        dataIndex: 'salaryMonth',
        key: 'salaryMonth',
        render: incentiveDate => new Date(incentiveDate).toLocaleString('en-US', { month: 'long' }),
    },
    {
        title: <Typography.Text>Monthly Target</Typography.Text>,
        dataIndex: 'monthlyTarget',
        key: 'monthlyTarget',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },
    {
        title: <Typography.Text>Achieved Target</Typography.Text>,
        dataIndex: 'achievedTarget',
        key: 'achievedTarget',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },
    {
        title: <Typography.Text>Achieved Sales Percentage (%)</Typography.Text>,
        dataIndex: 'percentageOfSales',
        key: 'percentageOfSales',
    },
    {
        title: <Typography.Text>Incentives Amount</Typography.Text>,
        dataIndex: 'incentiveAmount',
        key: 'incentiveAmount',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },

    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: 'status',
        render: text => {
            // Convert all to lowercase and then capitalize the first letter
            const formattedText = text.toLowerCase();
            return `${formattedText.charAt(0).toUpperCase()}${formattedText.slice(1)}`;
        },
    },
    {
        title: <Typography.Text>Action</Typography.Text>,
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
            <Space size="middle">
                <Button className="border-0" onClick={() => handleDelete(record)}>
                    <DeleteOutlined className="text-[#E30000]" />
                </Button>
                <Button className="border-0" onClick={() => handleEdit(record)}>
                    <EditOutlined className="text-[#E30000]" />
                </Button>
            </Space>
        ),
    },
];

export const bonusColumn = (
    handleDelete: (id: bonusTable) => void,
    handleEdit: (id: bonusTable) => void
): TableProps<bonusTable>['columns'] => [
    {
        title: <Typography.Text>Date Added</Typography.Text>,
        dataIndex: 'dateAdded',
        key: 'dateAdded',
    },
    {
        title: <Typography.Text>Effective Date</Typography.Text>,
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
    },
    {
        title: <Typography.Text>Salary Month</Typography.Text>,
        dataIndex: 'salaryMonth',
        key: 'salaryMonth',
        render: bonusDate => new Date(bonusDate).toLocaleString('en-US', { month: 'long' }),
    },
    {
        title: <Typography.Text>Bonus Percentage (%)</Typography.Text>,
        dataIndex: 'bonusPercentage',
        key: 'bonusPercentage',
    },
    {
        title: <Typography.Text>Bonus Amount</Typography.Text>,
        dataIndex: 'bonusAmount',
        key: 'bonusAmount',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },
    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: 'status',
        render: text => {
            // Convert all to lowercase and then capitalize the first letter
            const formattedText = text.toLowerCase();
            return `${formattedText.charAt(0).toUpperCase()}${formattedText.slice(1)}`;
        },
    },
    {
        title: <Typography.Text>Action</Typography.Text>,
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
            <Space size="middle">
                <Button className="border-0">
                    <DeleteOutlined
                        className="text-[#E30000]"
                        onClick={() => handleDelete(record)}
                    />
                </Button>
                <Button className="border-0">
                    <EditOutlined className="text-[#E30000]" onClick={() => handleEdit(record)} />
                </Button>
            </Space>
        ),
    },
];
export const overtimeColumn = (
    handleDelete: (record: overtimeTable) => void,
    handleEdit: (record: overtimeTable) => void
): TableProps<overtimeTable>['columns'] => [
    {
        title: <Typography.Text>Date Added</Typography.Text>,
        dataIndex: 'dateAdded',
        key: 'dateAdded',
    },
    {
        title: <Typography.Text>Effective Date</Typography.Text>,
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
    },
    {
        title: <Typography.Text>Salary Month</Typography.Text>,
        dataIndex: 'salaryMonth',
        key: 'salaryMonth',
        render: overTimeDate => new Date(overTimeDate).toLocaleString('en-US', { month: 'long' }),
    },
    {
        title: <Typography.Text>Total Working Hours</Typography.Text>,
        dataIndex: 'totalWorkingHours',
        key: 'totalWorkingHours',
    },
    {
        title: <Typography.Text>Extra Hours</Typography.Text>,
        dataIndex: 'extraHours',
        key: 'extraHours',
    },
    {
        title: <Typography.Text>Over Time Amount</Typography.Text>,
        dataIndex: 'overTimeAmount',
        key: 'overTimeAmount',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },
    {
        title: <Typography.Text>Over Time Rate</Typography.Text>,
        dataIndex: 'overTimeRate',
        key: 'overTimeRate',
    },
    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: 'status',
        render: text => {
            // Convert all to lowercase and then capitalize the first letter
            const formattedText = text.toLowerCase();
            return `${formattedText.charAt(0).toUpperCase()}${formattedText.slice(1)}`;
        },
    },
    {
        title: <Typography.Text>Action</Typography.Text>,
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
            <Space size="middle">
                <Button className="border-0" onClick={() => handleDelete(record)}>
                    <DeleteOutlined className="text-[#E30000]" />
                </Button>
                <Button className="border-0" onClick={() => handleEdit(record)}>
                    <EditOutlined className="text-[#E30000]" />
                </Button>
            </Space>
        ),
    },
];
export const reimbursementColumn = (
    handleDelete: (id: reimbursementTableType) => void,
    handleEdit: (id: reimbursementTableType) => void
): TableProps<reimbursementTableType>['columns'] => [
    {
        title: <Typography.Text>Expense Date</Typography.Text>,
        dataIndex: 'expenseDate',
        key: 'expenseDate',
    },
    {
        title: <Typography.Text>Expense Details</Typography.Text>,
        dataIndex: 'expenseDetails',
        key: 'expenseDetails',
    },
    {
        title: <Typography.Text>Amount Paid</Typography.Text>,
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: text =>
            `AED ${parseFloat(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    },

    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: 'status',
        render: text => {
            // Apply formatText function to format the status
            const formattedText = formatText(text);
            return (
                <Typography.Text className="font-normal" style={{ color: '#42526D' }}>
                    {formattedText}
                </Typography.Text>
            );
        },
    },
    {
        title: <Typography.Text>Action</Typography.Text>,
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
            <Space size="middle">
                <a href={record.supportingDocs} target="_blank" rel="noopener noreferrer" download>
                    <Button className="border-0" disabled={record.invoice === 'NA'}>
                        <DownloadOutlined
                            className={`text-green-400 ${record.invoice === 'NA' ? 'opacity-50' : ''}`}
                        />
                    </Button>
                </a>

                <Button className="border-0">
                    <DeleteOutlined
                        className="text-[#E30000]"
                        onClick={() => handleDelete(record)}
                    />
                </Button>
                <Button className="border-0">
                    <EditOutlined className="text-[#E30000]" onClick={() => handleEdit(record)} />
                </Button>
            </Space>
        ),
    },
];

export const AllReimbursementColumn = (
    handleDelete: (id: reimbursementTableType) => void,
    handleEdit: (id: reimbursementTableType) => void
): TableProps<reimbursementTableType>['columns'] => [
    {
        title: <Typography.Text>Employee Name</Typography.Text>,
        dataIndex: 'employeeName',
        key: 'employeeName',
    },
    {
        title: <Typography.Text>Expense Date</Typography.Text>,
        dataIndex: 'expenseDate',
        key: 'expenseDate',
    },
    {
        title: <Typography.Text>Expense Details</Typography.Text>,
        dataIndex: 'expenseDetails',
        key: 'expenseDetails',
    },
    {
        title: <Typography.Text>Amount Paid</Typography.Text>,
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: text => `AED ${formatNumberWithLocalString(text)}`,
    },
    {
        title: <Typography.Text>Status</Typography.Text>,
        dataIndex: 'status',
        key: 'status',
        render: text => {
            const formattedText = formatText(text);

            return (
                <Typography.Text className="font-normal" style={{ color: '#42526D' }}>
                    {formattedText}
                </Typography.Text>
            );
        },
    },

    {
        title: <Typography.Text>Action</Typography.Text>,
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
            <Space size="middle">
                <a href={record.supportingDocs} target="_blank" rel="noopener noreferrer" download>
                    <Button className="border-0" disabled={record.invoice === 'NA'}>
                        <DownloadOutlined
                            className={`text-green-400 ${record.invoice === 'NA' ? 'opacity-50' : ''}`}
                        />
                    </Button>
                </a>

                <Button className="border-0">
                    <DeleteOutlined
                        className="text-[#E30000]"
                        onClick={() => handleDelete(record)}
                    />
                </Button>
                <Button className="border-0">
                    <EditOutlined className="text-[#E30000]" onClick={() => handleEdit(record)} />
                </Button>
            </Space>
        ),
    },
];
